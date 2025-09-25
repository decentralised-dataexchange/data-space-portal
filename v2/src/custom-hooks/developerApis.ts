import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch, useAppSelector } from './store';
import { LocalStorageService } from '@/utils/localStorageService';
import { OAuth2ClientsListResponse, OAuth2ClientCreateResponse } from '@/types/oauth2';
import { OrganisationOAuth2ExternalClientsListResponse, OrganisationOAuth2ExternalClientResponse } from '@/types/organisationOAuth2External';
import { SoftwareStatementResponse } from '@/types/softwareStatement';
import { Organisation } from '@/types/organisation';

// Hook to get admin details
export const useGetAdminDetails = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return useQuery({
    queryKey: ['adminDetails'],
    queryFn: async () => {
      try {
        const data = await apiService.getAdminDetails();
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch admin details';
        console.error('Error in getAdminDetails:', errorMessage, error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// LocalStorage key to remember that request-credential was initiated
const LS_KEY_REQUEST_CREDENTIAL_PENDING = 'developerAPIs:requestCredentialPending';

// Helper to evaluate availability of software statement
const isSoftwareStatementAvailable = (res: SoftwareStatementResponse | undefined): boolean => {
  if (!res || !res.softwareStatement) return false;
  if (Object.keys(res.softwareStatement).length === 0) return false;
  return res.status === 'credential_accepted';
};

// Pending statuses indicating an in-progress flow that warrants refocus checks
const isSoftwareStatementPending = (res: SoftwareStatementResponse | undefined): boolean => {
  if (!res) return false;
  const s = (res.status ?? '').toLowerCase();
  return s === 'offer_sent' || s === 'offer_received' || s === 'credential_acked';
};

export interface UseSoftwareStatementRequestRefocusResult {
  requestCredential: () => Promise<SoftwareStatementResponse | undefined>;
  isRequesting: boolean;
  clearPendingMarker: () => void;
}

export interface UseSoftwareStatementRequestRefocusParams {
  orgId?: string;
  ttlMs?: number; // how long to keep the pending marker alive
}

// Hook to manage "Request Credential" flow with tab-refocus recheck
export const useSoftwareStatementRequestRefocus = (
  params?: UseSoftwareStatementRequestRefocusParams
): UseSoftwareStatementRequestRefocusResult => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const requestMutation = useRequestSoftwareStatement();
  const orgId = params?.orgId;
  const ttlMs = params?.ttlMs ?? 10 * 60 * 1000; // default 10 minutes

  const clearPendingMarker = React.useCallback(() => {
    try { localStorage.removeItem(LS_KEY_REQUEST_CREDENTIAL_PENDING); } catch {}
  }, []);

  const requestCredential = React.useCallback(async (): Promise<SoftwareStatementResponse | undefined> => {
    try {
      const res = await requestMutation.mutateAsync();
      // Mark that we should recheck on next tab focus until available
      const payload = JSON.stringify({ orgId: orgId ?? null, clickedAt: Date.now() });
      try { localStorage.setItem(LS_KEY_REQUEST_CREDENTIAL_PENDING, payload); } catch {}
      return res;
    } catch (e) {
      throw e;
    }
  }, [requestMutation, orgId]);

  // On window focus, if request was initiated and statement isn't available yet, refetch once
  React.useEffect(() => {
    if (!isAuthenticated || !orgId) return;
    const onFocus = async () => {
      try {
        const raw = localStorage.getItem(LS_KEY_REQUEST_CREDENTIAL_PENDING);
        let marker: { orgId?: string | null; clickedAt?: number } | undefined;
        if (raw) {
          try { marker = JSON.parse(raw); } catch { marker = undefined; }
        }
        const current = queryClient.getQueryData<SoftwareStatementResponse | undefined>(['softwareStatement']);

        // Evaluate marker validity
        const markerValid = !!marker && typeof marker.clickedAt === 'number'
          && (Date.now() - (marker.clickedAt ?? 0) <= ttlMs)
          && (!marker.orgId || marker.orgId === orgId);

        // Determine if we should refetch on this focus: either marker is valid OR status is pending
        const shouldRefetch = markerValid || isSoftwareStatementPending(current);
        if (!shouldRefetch) return;

        if (isSoftwareStatementAvailable(current)) {
          clearPendingMarker();
          return;
        }
        // Refetch once per focus
        await queryClient.refetchQueries({ queryKey: ['softwareStatement'], exact: true });
        const updated = queryClient.getQueryData<SoftwareStatementResponse | undefined>(['softwareStatement']);
        if (isSoftwareStatementAvailable(updated)) {
          clearPendingMarker();
        }
      } catch {
        // swallow
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isAuthenticated, queryClient, clearPendingMarker, orgId, ttlMs]);

  return {
    requestCredential,
    isRequesting: requestMutation.isPending,
    clearPendingMarker,
  };
};

// Organisation OAuth2 Client - External
export const useGetOrganisationOAuth2ClientsExternal = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return useQuery<OrganisationOAuth2ExternalClientsListResponse>({
    queryKey: ['organisationOAuth2ClientsExternal'],
    queryFn: async () => {
      try {
        return await apiService.getOrganisationOAuth2ClientsExternal();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Organisation OAuth2 clients (external)';
        console.error('Error in getOrganisationOAuth2ClientsExternal:', errorMessage, error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateOrganisationOAuth2ClientExternal = () => {
  const queryClient = useQueryClient();
  return useMutation<OrganisationOAuth2ExternalClientResponse, unknown, { name: string; client_id: string; client_secret: string; description?: string }>({
    mutationFn: async (payload) => {
      try {
        return await apiService.createOrganisationOAuth2ClientExternal(payload);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create Organisation OAuth2 client (external)';
        console.error('Error in createOrganisationOAuth2ClientExternal:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisationOAuth2ClientsExternal'] });
    }
  });
};

export const useUpdateOrganisationOAuth2ClientExternal = () => {
  const queryClient = useQueryClient();
  return useMutation<OrganisationOAuth2ExternalClientResponse, unknown, { clientId: string; name: string; client_id: string; client_secret: string; description?: string }>({
    mutationFn: async ({ clientId, name, client_id, client_secret, description }) => {
      try {
        return await apiService.updateOrganisationOAuth2ClientExternal(clientId, { name, client_id, client_secret, description });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update Organisation OAuth2 client (external)';
        console.error('Error in updateOrganisationOAuth2ClientExternal:', errorMessage, error);
        throw error;
      }
    },
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisationOAuth2ClientsExternal'] });
    }
  });
};

export const useDeleteOrganisationOAuth2ClientExternal = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, { clientId: string }>({
    mutationFn: async ({ clientId }) => {
      try {
        return await apiService.deleteOrganisationOAuth2ClientExternal(clientId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete Organisation OAuth2 client (external)';
        console.error('Error in deleteOrganisationOAuth2ClientExternal:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisationOAuth2ClientsExternal'] });
    }
  });
};

// Hook to get Software Statement
export const useGetSoftwareStatement = (options?: { enabled?: boolean }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const enabled = Boolean(isAuthenticated && (options?.enabled ?? true));
  return useQuery<SoftwareStatementResponse>({
    queryKey: ['softwareStatement'],
    queryFn: async () => {
      try {
        return await apiService.getSoftwareStatement();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch software statement';
        console.error('Error in getSoftwareStatement:', errorMessage, error);
        throw error;
      }
    },
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to request a new Software Statement
export const useRequestSoftwareStatement = () => {
  const queryClient = useQueryClient();
  return useMutation<SoftwareStatementResponse, unknown, void>({
    mutationFn: async () => {
      try {
        return await apiService.requestSoftwareStatement();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to request software statement';
        console.error('Error in requestSoftwareStatement:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['softwareStatement'] });
    }
  });
};

// Hook to delete Software Statement
export const useDeleteSoftwareStatement = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      try {
        await apiService.deleteSoftwareStatement();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete software statement';
        console.error('Error in deleteSoftwareStatement:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: async () => {
      // Ensure we re-fetch the now-empty software statement
      await queryClient.invalidateQueries({ queryKey: ['softwareStatement'] });
      await queryClient.refetchQueries({ queryKey: ['softwareStatement'] });
    }
  });
};

// Hook to update organisation (e.g., update organisation wallet base URL)
export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, unknown, { organisation: Organisation }>({
    mutationFn: async (payload: { organisation: Organisation }) => {
      // Call the unified organisation update endpoint
      return apiService.updateOrganisation({ organisation: payload.organisation });
    },
    onSuccess: () => {
      // Refetch organisation details
      queryClient.invalidateQueries({ queryKey: ['organizationDetails'] });
    }
  });
};

// Hook to get organization details
export const useGetOrganizationDetails = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return useQuery({
    queryKey: ['organizationDetails'],
    queryFn: async () => {
      try {
        const data = await apiService.getOrganisationsDetails();
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization details';
        console.error('Error in getOrganizationDetails:', errorMessage, error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to update OpenAPI URL
export const useUpdateOpenApiUrl = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { dataSource: { openApiUrl: string } }) => {
      try {
        const data = await apiService.updateOpenApiUrl(payload);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update OpenAPI URL';
        console.error('Error in updateOpenApiUrl:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the organization details query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['organizationDetails'] });
    },
  });
};

// Hook to get the API token in the correct format
export const useGetApiToken = () => {
  return {
    getFormattedToken: () => {
      const token = LocalStorageService.getAccessToken();
      return token ? `Bearer ${token}` : '';
    }
  };
};

// Hook to list OAuth2 clients
export const useGetOAuth2Clients = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return useQuery<OAuth2ClientsListResponse>({
    queryKey: ['oauth2Clients'],
    queryFn: async () => {
      try {
        return await apiService.getOAuth2Clients();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch OAuth2 clients';
        console.error('Error in getOAuth2Clients:', errorMessage, error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook to create an OAuth2 client
export const useCreateOAuth2Client = () => {
  const queryClient = useQueryClient();
  return useMutation<OAuth2ClientCreateResponse, unknown, { name: string; description?: string }>({
    mutationFn: async (payload: { name: string; description?: string }) => {
      try {
        return await apiService.createOAuth2Client(payload);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create OAuth2 client';
        console.error('Error in createOAuth2Client:', errorMessage, error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ['oauth2Clients'] });
    }
  });
};

// Hook to update an existing OAuth2 client
export const useUpdateOAuth2Client = () => {
  const queryClient = useQueryClient();
  return useMutation<OAuth2ClientCreateResponse, unknown, { clientId: string; name?: string; description?: string }>({
    mutationFn: async ({ clientId, name, description }) => {
      try {
        return await apiService.updateOAuth2Client(clientId, { name, description });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update OAuth2 client';
        console.error('Error in updateOAuth2Client:', errorMessage, error);
        throw error;
      }
    },
    retry: false,
    onSuccess: () => {
      // Refresh OAuth2 clients list after update
      queryClient.invalidateQueries({ queryKey: ['oauth2Clients'] });
    }
  });
};
