import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppSelector } from '@/custom-hooks/store';
import { DataDisclosureAgreement } from '@/types/dataDisclosureAgreement';

// Strongly typed API response for business wallet initiation
export interface BusinessWalletInitiateResponse {
  verificationRequest: string;
  status: 'sign' | 'unsign' | string;
}

export interface BusinessWalletStatusResponse {
  status: 'sign' | 'unsign' | string;
}

// Helper to collect candidate IDs for a DDA
const collectCandidateIds = (d: DataDisclosureAgreement | undefined): string[] => {
  if (!d) return [];
  const list: Array<string | undefined> = [
    d.templateId,
    d['@id'],
    d.dataAgreementId,
    d.dataAgreementRevisionId,
  ];
  return list.filter((x): x is string => typeof x === 'string' && x.length > 0);
};

// Core API call encapsulation
const initiateForId = async (ddaId: string): Promise<BusinessWalletInitiateResponse> => {
  return apiService.signOrSignWithBusinessWalletInitiate(ddaId);
};
const getStatusForId = async (ddaId: string): Promise<BusinessWalletStatusResponse> => {
  return apiService.getOrganisationDDAStatus(ddaId);
};

export interface UseBusinessWalletSigningParams {
  selectedDDA?: DataDisclosureAgreement;
  enabled?: boolean; // when true, fetch initial status for selectedDDA
  enableFocusRefresh?: boolean; // when true, attach a single window focus listener to refresh status after external redirect
}

export interface UseBusinessWalletSigningResult {
  signStatus: 'sign' | 'unsign' | '';
  isFetchingStatus: boolean;
  initiateSignOrUnsign: () => Promise<BusinessWalletInitiateResponse | undefined>;
  refetchStatus: () => Promise<BusinessWalletStatusResponse | undefined>;
  isInitiating: boolean;
}

export function useBusinessWalletSigning(
  { selectedDDA, enabled = false, enableFocusRefresh = false }: UseBusinessWalletSigningParams
): UseBusinessWalletSigningResult {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const candidateIds = React.useMemo(() => collectCandidateIds(selectedDDA), [selectedDDA]);
  const selectedId = candidateIds[0]; // prefer templateId when present

  // Helper: try multiple candidate IDs sequentially (treat 404 as try-next) for POST initiate
  const initiateWithFallback = React.useCallback(async (ids: string[]): Promise<BusinessWalletInitiateResponse> => {
    let lastErr: unknown = undefined;
    for (const id of ids) {
      try {
        return await initiateForId(id);
      } catch (e: unknown) {
        lastErr = e;
        const maybeAxiosErr = e as { response?: { status?: number } };
        if (maybeAxiosErr?.response?.status === 404) continue;
        throw e;
      }
    }
    throw lastErr ?? new Error('Failed to initiate business wallet flow');
  }, []);

  // GET status: use only the preferred selectedId (typically templateId) to avoid multiple requests
  const getStatusDirect = React.useCallback(async (): Promise<BusinessWalletStatusResponse> => {
    if (!selectedId) throw new Error('Missing DDA id');
    return getStatusForId(selectedId);
  }, [selectedId]);

  const statusQuery = useQuery<BusinessWalletStatusResponse>({
    queryKey: ['businessWalletStatus', selectedId],
    queryFn: async () => {
      if (!selectedId) throw new Error('Missing DDA id');
      return getStatusDirect();
    },
    enabled: Boolean(enabled && isAuthenticated && selectedId),
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  const signStatus: 'sign' | 'unsign' | '' = statusQuery.data?.status === 'sign' || statusQuery.data?.status === 'unsign'
    ? statusQuery.data.status
    : '';

  // Mutation for user-initiated sign/unsign action
  const initiateMutation = useMutation<BusinessWalletInitiateResponse, unknown, string>({
    mutationFn: async (ddaId: string) => initiateForId(ddaId),
    onSuccess: (data, ddaId) => {
      // Cache status for this DDA id (only status field relevant)
      queryClient.setQueryData(['businessWalletStatus', ddaId], { status: data.status } satisfies BusinessWalletStatusResponse);
    },
  });

  // Helper to trigger initiate for current selectedDDA (with fallback over candidate IDs)
  const initiateSignOrUnsign = React.useCallback(async (): Promise<BusinessWalletInitiateResponse | undefined> => {
    if (!isAuthenticated) return undefined;
    for (const cid of candidateIds) {
      try {
        const res = await initiateMutation.mutateAsync(cid);
        return res;
      } catch (e: unknown) {
        // Continue on 404, surface other errors
        const maybeAxiosErr = e as { response?: { status?: number } };
        if (maybeAxiosErr?.response?.status === 404) continue;
        throw e;
      }
    }
    return undefined;
  }, [candidateIds, initiateMutation, isAuthenticated]);

  // Manual refetch for current selected DDA (called by parents explicitly)
  const refetchStatus = React.useCallback(async (): Promise<BusinessWalletStatusResponse | undefined> => {
    if (!isAuthenticated || !selectedId) return undefined;
    try {
      const res = await getStatusDirect();
      queryClient.setQueryData(['businessWalletStatus', selectedId], res);
      return res;
    } catch {
      return undefined;
    }
  }, [getStatusDirect, isAuthenticated, queryClient, selectedId]);

  // On window focus, if modal is open (enableFocusRefresh), recheck status for the currently selected DDA id
  React.useEffect(() => {
    if (!isAuthenticated || !enableFocusRefresh || !selectedId) return;
    let inProgress = false;
    const onFocus = async () => {
      if (inProgress) return;
      inProgress = true;
      try {
        await refetchStatus();
      } finally {
        inProgress = false;
      }
    };
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [isAuthenticated, enableFocusRefresh, refetchStatus, selectedId]);

  return {
    signStatus,
    isFetchingStatus: statusQuery.isFetching,
    initiateSignOrUnsign,
    refetchStatus,
    isInitiating: initiateMutation.isPending,
  };
}
