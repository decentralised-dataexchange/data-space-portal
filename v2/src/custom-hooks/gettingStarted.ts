import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch } from './store';
import {
  setGettingStartLoading,
  setGettingStartSuccess,
  setGettingStartFailure,
  setListConnectionLoading,
  setListConnectionSuccess,
  setListConnectionFailure,
  setVerificationTemplateLoading,
  setVerificationTemplateSuccess,
  setVerificationTemplateFailure,
  setVerificationLoading,
  setVerificationSuccess,
  setVerificationFailure,
  setImages,
} from '@/store/reducers/gettingStartReducers';

// Hook for getting started data
export const useGetGettingStartData = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['gettingStartData'],
    queryFn: async () => {
      console.log('DEBUG: Starting to fetch gettingStartData');
      dispatch(setGettingStartLoading());
      try {
        console.log('DEBUG: Calling apiService.getGettingStartData()');
        const data = await apiService.getGettingStartData();
        console.log('DEBUG: getGettingStartData response:', data);
        dispatch(setGettingStartSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch getting start data';
        console.error('DEBUG: Error in getGettingStartData:', errorMessage, error);
        dispatch(setGettingStartFailure(errorMessage));
        throw error;
      }
    },
    retry: 1, // Only retry once to avoid infinite loading
  });
};

// Hook for listing connections
export const useListConnections = (limit: number = 10, offset: number = 0, restrictTemplate: boolean = false) => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['listConnections', limit, offset, restrictTemplate],
    queryFn: async () => {
      dispatch(setListConnectionLoading());
      try {
        const data = await apiService.listConnections(limit, offset, restrictTemplate);
        dispatch(setListConnectionSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch connections';
        dispatch(setListConnectionFailure(errorMessage));
        throw error;
      }
    },
  });
};

// Hook for getting verification template
export const useGetVerificationTemplate = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['verificationTemplate'],
    queryFn: async () => {
      dispatch(setVerificationTemplateLoading());
      try {
        const data = await apiService.getVerificationTemplate();
        dispatch(setVerificationTemplateSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch verification template';
        dispatch(setVerificationTemplateFailure(errorMessage));
        throw error;
      }
    },
    enabled: false, // This query will not run automatically
  });
};

// Hook for creating verification
export const useCreateVerification = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: async () => {
      dispatch(setVerificationLoading());
      try {
        const data = await apiService.createVerification();
        dispatch(setVerificationSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create verification';
        dispatch(setVerificationFailure(errorMessage));
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries after successful mutation
      queryClient.invalidateQueries({ queryKey: ['verification'] });
    },
  });
};

// Hook for getting verification
export const useGetVerification = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['verification'],
    queryFn: async () => {
      dispatch(setVerificationLoading());
      try {
        const data = await apiService.getVerification();
        dispatch(setVerificationSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch verification';
        dispatch(setVerificationFailure(errorMessage));
        throw error;
      }
    },
    enabled: false, // This query will not run automatically
  });
};

// Hook for creating verification with polling functionality
export const useCreateVerificationWithPolling = () => {
  const dispatch = useAppDispatch();
  const createVerificationMutation = useMutation({
    mutationFn: async (startPoll: (data: any) => void) => {
      dispatch(setVerificationLoading());
      try {
        // First create the verification
        await apiService.createVerification();
        
        // Then get the verification status
        const data = await apiService.getVerification();
        dispatch(setVerificationSuccess(data));
        
        // Start polling if callback provided
        if (startPoll) {
          startPoll(data);
        }
        
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create verification';
        dispatch(setVerificationFailure(errorMessage));
        throw error;
      }
    }
  });
  
  return createVerificationMutation;
};

// Hook for reading verification with polling functionality
export const useReadVerificationWithPolling = () => {
  const dispatch = useAppDispatch();
  const readVerificationMutation = useMutation({
    mutationFn: async (startPoll?: (data: any) => void) => {
      dispatch(setVerificationLoading());
      try {
        const data = await apiService.getVerification();
        dispatch(setVerificationSuccess(data));
        
        // Call the polling callback if provided
        if (startPoll) {
          startPoll(data);
        }
        
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to read verification';
        dispatch(setVerificationFailure(errorMessage));
        throw error;
      }
    }
  });
  
  return readVerificationMutation;
};

// Hook for updating data source
export const useUpdateDataSource = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (payload: unknown) => apiService.updateDataSource(payload),
    onSuccess: () => {
      // Invalidate and refetch getting started data after successful update
      queryClient.invalidateQueries({ queryKey: ['gettingStartData'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update data source';
      dispatch(setGettingStartFailure(errorMessage));
    },
  });
};

// Hook for getting cover image
export const useGetCoverImage = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['coverImage'],
    queryFn: async () => {
      try {
        const coverImage = await apiService.getCoverImage();
        // Only update Redux if we got a valid image
        if (coverImage) {
          dispatch(setImages({ logo: null, cover: coverImage }));
        }
        return coverImage || ''; // Return empty string instead of null/undefined to avoid hydration issues
      } catch (error) {
        console.error('Error fetching cover image:', error);
        return ''; // Return empty string on error to avoid null/undefined
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

// Hook for getting logo image
export const useGetLogoImage = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: ['logoImage'],
    queryFn: async () => {
      try {
        const logoImage = await apiService.getLogoImage();
        // Only update Redux if we got a valid image
        if (logoImage) {
          dispatch(setImages({ logo: logoImage, cover: null }));
        }
        return logoImage || ''; // Return empty string instead of null/undefined to avoid hydration issues
      } catch (error) {
        console.error('Error fetching logo image:', error);
        return ''; // Return empty string on error to avoid null/undefined
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

// Hook for updating logo image
export const useUpdateLogoImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => {
      return apiService.updateOrganisationLogoImage(formData);
    },
    onSuccess: () => {
      // Invalidate the logo image query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['logoImage'] });
    },
  });
};

// Hook for updating cover image
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => {
      return apiService.updateOrganisationCoverImage(formData);
    },
    onSuccess: () => {
      // Invalidate the cover image query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['coverImage'] });
    },
  });
};
