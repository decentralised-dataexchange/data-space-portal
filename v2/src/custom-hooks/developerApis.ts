import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch, useAppSelector } from './store';
import { LocalStorageService } from '@/utils/localStorageService';
import { OAuth2ClientsListResponse, OAuth2ClientCreateResponse } from '@/types/oauth2';
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
