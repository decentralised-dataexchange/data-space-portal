import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch } from './store';
import {
  setGettingStartLoading,
  setGettingStartSuccess,
  setGettingStartFailure,
  setImages,
} from '@/store/reducers/gettingStartReducers';


import { OrgIdentityResponse } from '@/types/orgIdentity';
import { OrganisationResponse, OrganisationUpdatePayload } from '@/types/organisation';

export const useGetOrgIdentity = (orgId: string) => {
  const dispatch = useAppDispatch();
  
  return useQuery<OrgIdentityResponse, Error>({
    queryKey: ['orgIdentity', orgId],
    queryFn: async (): Promise<OrgIdentityResponse> => {
      dispatch(setGettingStartLoading());
      try {
        const data = await apiService.getOrgIdentity();
        dispatch(setGettingStartSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch getting start data';
        dispatch(setGettingStartFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    staleTime: 0,
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

// Auto-create org identity once when empty identity, empty state and not verified
export const useAutoCreateOrgIdentity = (orgIdentityResp?: OrgIdentityResponse) => {
  const { mutateAsync: createOrgIdentity } = useCreateOrgIdentity();
  useEffect(() => {
    if (!orgIdentityResp) return;
    const identityObj = (orgIdentityResp as any)?.organisationalIdentity || {};
    const isEmptyIdentity = identityObj && Object.keys(identityObj).length === 0;
    const shouldCreate = isEmptyIdentity && orgIdentityResp.state === '' && orgIdentityResp.verified === false;
    if (shouldCreate) {
      createOrgIdentity().catch((e) => console.error('Failed to create org identity', e));
    }
  }, [orgIdentityResp, createOrgIdentity]);
};

// Poll org identity only when not verified, state set, and identity object exists
export const useOrgIdentityPolling = (orgIdentityResp: OrgIdentityResponse | undefined, organisationId: string) => {
  const queryClient = useQueryClient();
  const pollTimers = useRef<number[]>([]);

  useEffect(() => {
    // Clear any existing timers when dependencies change or on unmount
    pollTimers.current.forEach((t) => clearTimeout(t));
    pollTimers.current = [];

    const identity = orgIdentityResp?.organisationalIdentity as any;
    const hasIdentity = identity && Object.keys(identity).length > 0;
    const shouldPoll = !!orgIdentityResp && orgIdentityResp.verified === false && !!orgIdentityResp.state && hasIdentity;

    if (!shouldPoll) {
      return () => {
        pollTimers.current.forEach((t) => clearTimeout(t));
        pollTimers.current = [];
      };
    }

    const t1 = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['orgIdentity', organisationId] });
    }, 60 * 1000);
    const t2 = window.setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['orgIdentity', organisationId] });
    }, 120 * 1000);
    pollTimers.current = [t1, t2];

    return () => {
      pollTimers.current.forEach((t) => clearTimeout(t));
      pollTimers.current = [];
    };
  }, [orgIdentityResp?.verified, orgIdentityResp?.state, organisationId, queryClient, orgIdentityResp?.organisationalIdentity]);
};

export const useCreateOrgIdentity = () => {
  const dispatch = useAppDispatch();
  return useMutation<OrgIdentityResponse, Error, void>({
    mutationFn: () => apiService.createOrgIdentity(),
    onSuccess: (data) => {
      dispatch(setGettingStartSuccess(data));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization identity';
      dispatch(setGettingStartFailure(errorMessage));
    },
  });
};

// Fetch current logged-in user's organisation details
export const useGetOrganisation = () => {
  const dispatch = useAppDispatch();
  return useQuery<OrganisationResponse, Error>({
    queryKey: ['organisation'],
    queryFn: async (): Promise<OrganisationResponse> => {
      dispatch(setGettingStartLoading());
      try {
        const data = await apiService.getOrganisation();
        dispatch(setGettingStartSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organisation data';
        dispatch(setGettingStartFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Update organisation details
export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation<OrganisationResponse, Error, OrganisationUpdatePayload>({
    mutationFn: (payload: OrganisationUpdatePayload) => apiService.updateOrganisation(payload),
    onSuccess: (data) => {
      dispatch(setGettingStartSuccess(data));
      queryClient.invalidateQueries({ queryKey: ['organisation'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update organisation';
      dispatch(setGettingStartFailure(errorMessage));
    },
  });
};

// Cover Image: fetch
export const useGetCoverImage = () => {
  const dispatch = useAppDispatch();
  return useQuery<string, Error>({
    queryKey: ['coverImage'],
    queryFn: async (): Promise<string> => {
      try {
        const coverImage = await apiService.getCoverImage();
        if (coverImage) {
          dispatch(setImages({ logo: null, cover: coverImage }));
        }
        return coverImage || '';
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching cover image:', errorMessage);
        return '';
      }
    },
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

// Logo Image: fetch
export const useGetLogoImage = () => {
  const dispatch = useAppDispatch();
  return useQuery<string, Error>({
    queryKey: ['logoImage'],
    queryFn: async (): Promise<string> => {
      try {
        const logoImage = await apiService.getLogoImage();
        if (logoImage) {
          dispatch(setImages({ logo: logoImage, cover: null }));
        }
        return logoImage || '';
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching logo image:', errorMessage);
        return '';
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Cover Image: update
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  return useMutation<{ Organization: any }, Error, FormData>({
    mutationFn: (formData: FormData) => apiService.updateOrganisationCoverImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverImage'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cover image';
      console.error('Error updating cover image:', errorMessage);
    },
  });
};
