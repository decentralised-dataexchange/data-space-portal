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

// LocalStorage key to remember last clicked DDA for refocus recheck
const LS_KEY_LAST_DDA = 'businessWallet:lastDdaId';

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

export interface UseBusinessWalletSigningParams {
  selectedDDA?: DataDisclosureAgreement;
  enabled?: boolean; // when true, fetch initial status for selectedDDA
}

export interface UseBusinessWalletSigningResult {
  signStatus: 'sign' | 'unsign' | '';
  isFetchingStatus: boolean;
  initiateSignOrUnsign: () => Promise<BusinessWalletInitiateResponse | undefined>;
  refetchStatus: () => Promise<BusinessWalletInitiateResponse | undefined>;
  isInitiating: boolean;
}

export function useBusinessWalletSigning(
  { selectedDDA, enabled = false }: UseBusinessWalletSigningParams
): UseBusinessWalletSigningResult {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const candidateIds = React.useMemo(() => collectCandidateIds(selectedDDA), [selectedDDA]);
  const selectedId = candidateIds[0]; // prefer templateId when present

  // Query to get current status for the selected DDA (calls POST endpoint by design)
  // Helper: try multiple candidate IDs sequentially (treat 404 as try-next)
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

  const statusQuery = useQuery<BusinessWalletInitiateResponse>({
    queryKey: ['businessWalletStatus', selectedId],
    queryFn: async () => {
      if (!selectedId) throw new Error('Missing DDA id');
      return initiateWithFallback(candidateIds);
    },
    enabled: Boolean(enabled && isAuthenticated && selectedId),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const signStatus: 'sign' | 'unsign' | '' = statusQuery.data?.status === 'sign' || statusQuery.data?.status === 'unsign'
    ? statusQuery.data.status
    : '';

  // Mutation for user-initiated sign/unsign action
  const initiateMutation = useMutation<BusinessWalletInitiateResponse, unknown, string>({
    mutationFn: async (ddaId: string) => initiateForId(ddaId),
    onSuccess: (data, ddaId) => {
      // Cache status for this DDA id
      queryClient.setQueryData(['businessWalletStatus', ddaId], data);
      // Remember last clicked DDA for refocus recheck
      try { localStorage.setItem(LS_KEY_LAST_DDA, ddaId); } catch {}
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

  // Manual refetch for current selected DDA
  const refetchStatus = React.useCallback(async (): Promise<BusinessWalletInitiateResponse | undefined> => {
    if (!isAuthenticated || !selectedId) return undefined;
    try {
      const res = await initiateWithFallback(candidateIds);
      queryClient.setQueryData(['businessWalletStatus', selectedId], res);
      return res;
    } catch {
      return undefined;
    }
  }, [candidateIds, initiateWithFallback, isAuthenticated, queryClient, selectedId]);

  // On window focus, if the user previously clicked sign/unsign, recheck status for that DDA id
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const onFocus = async () => {
      try {
        const lastId = localStorage.getItem(LS_KEY_LAST_DDA);
        if (!lastId) return;
        const res = await initiateForId(lastId);
        queryClient.setQueryData(['businessWalletStatus', lastId], res);
        // Clear the marker to avoid repeated calls on every focus
        localStorage.removeItem(LS_KEY_LAST_DDA);
      } catch {
        // swallow
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [isAuthenticated, queryClient]);

  return {
    signStatus,
    isFetchingStatus: statusQuery.isFetching,
    initiateSignOrUnsign,
    refetchStatus,
    isInitiating: initiateMutation.isPending,
  };
}
