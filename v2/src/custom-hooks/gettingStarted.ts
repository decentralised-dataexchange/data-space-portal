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
  setVerification,
  setImages,
} from '@/store/reducers/gettingStartReducers';

// Define types for API responses
interface GettingStartData {
  dataSource: {
    name?: string;
    location?: string;
    policyUrl?: string;
    description?: string;
    sector?: string;
  };
  verification?: any;
  [key: string]: any;
}

interface ConnectionsData {
  connections: Array<{
    id: string;
    connectionState: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Import the VerificationTemplate type from the verification types
import { VerificationTemplate } from '@/types/verification';

/**
 * Hook for fetching getting started data
 * @returns Query result with typed GettingStartData
 */
export const useGetGettingStartData = () => {
  const dispatch = useAppDispatch();
  
  return useQuery<GettingStartData, Error>({
    queryKey: ['gettingStartData'],
    queryFn: async (): Promise<GettingStartData> => {
      dispatch(setGettingStartLoading());
      try {
        const data = await apiService.getGettingStartData();
        dispatch(setGettingStartSuccess(data));
        // Populate initial verification slice if data contains verification
        if (data.verification) {
          dispatch(setVerification({ verification: data.verification }));
        }
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch getting start data';
        dispatch(setGettingStartFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for listing connections
 * @param limit Maximum number of connections to fetch
 * @param offset Pagination offset
 * @param restrictTemplate Whether to restrict templates
 * @returns Query result with typed ConnectionsData
 */
export const useListConnections = (limit: number = 10, offset: number = 0, restrictTemplate: boolean = false) => {
  const dispatch = useAppDispatch();
  
  return useQuery<ConnectionsData, Error>({
    queryKey: ['listConnections', limit, offset, restrictTemplate],
    queryFn: async (): Promise<ConnectionsData> => {
      dispatch(setListConnectionLoading());
      try {
        const data = await apiService.listConnections(limit, offset, restrictTemplate);
        dispatch(setListConnectionSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch connections';
        dispatch(setListConnectionFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for getting verification templates
 * @returns Query result with array of VerificationTemplate objects
 */
export const useGetVerificationTemplate = () => {
  const dispatch = useAppDispatch();
  
  return useQuery<{ verificationTemplates: VerificationTemplate[] }, Error>({
    queryKey: ['verificationTemplate'],
    queryFn: async (): Promise<{ verificationTemplates: VerificationTemplate[] }> => {
      dispatch(setVerificationTemplateLoading());
      try {
        // The API returns { verificationTemplates: VerificationTemplate[] }
        const templates = await apiService.getVerificationTemplates();
        const data = { verificationTemplates: templates };
        dispatch(setVerificationTemplateSuccess(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch verification templates';
        dispatch(setVerificationTemplateFailure(errorMessage));
        throw new Error(errorMessage);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });
};


/**
 * Hook for updating data source information
 * @returns Mutation function for updating data source
 */
export const useUpdateDataSource = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  // Define the payload type for data source update
  interface DataSourceUpdatePayload {
    name?: string;
    location?: string;
    policyUrl?: string;
    description?: string;
    sector?: string;
    [key: string]: any;
  }
  
  return useMutation<any, Error, DataSourceUpdatePayload>({
    mutationFn: (payload: DataSourceUpdatePayload) => apiService.updateDataSource(payload),
    onSuccess: (data) => {
      // Invalidate and refetch getting started data after successful update
      queryClient.invalidateQueries({ queryKey: ['gettingStartData'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update data source';
      dispatch(setGettingStartFailure(errorMessage));
    },
  });
};

/**
 * Hook for getting cover image
 * @returns Query result with cover image as string (base64 or URL)
 */
export const useGetCoverImage = () => {
  const dispatch = useAppDispatch();
  
  return useQuery<string, Error>({
    queryKey: ['coverImage'],
    queryFn: async (): Promise<string> => {
      try {
        const coverImage = await apiService.getCoverImage();
        // Only update Redux if we got a valid image
        if (coverImage) {
          dispatch(setImages({ logo: null, cover: coverImage }));
        }
        return coverImage || ''; // Return empty string instead of null/undefined to avoid hydration issues
      } catch (error) {
        // Log error but don't throw - we want to return empty string instead of failing
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching cover image:', errorMessage);
        return ''; // Return empty string on error to avoid null/undefined
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for getting logo image
 * @returns Query result with logo image as string (base64 or URL)
 */
export const useGetLogoImage = () => {
  const dispatch = useAppDispatch();
  
  return useQuery<string, Error>({
    queryKey: ['logoImage'],
    queryFn: async (): Promise<string> => {
      try {
        const logoImage = await apiService.getLogoImage();
        // Only update Redux if we got a valid image
        if (logoImage) {
          dispatch(setImages({ logo: logoImage, cover: null }));
        }
        return logoImage || ''; // Return empty string instead of null/undefined to avoid hydration issues
      } catch (error) {
        // Log error but don't throw - we want to return empty string instead of failing
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching logo image:', errorMessage);
        return ''; // Return empty string on error to avoid null/undefined
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid infinite loading
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for updating organization logo image
 * @returns Mutation function for updating logo image
 */
export const useUpdateLogoImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ logoImage: string }, Error, File>({
    mutationFn: (file: File) => {
      return apiService.updateLogoImage(file);
    },
    onSuccess: () => {
      // Invalidate the logo image query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['logoImage'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update logo image';
      console.error('Error updating logo image:', errorMessage);
    },
  });
};

/**
 * Hook for updating organization cover image
 * @returns Mutation function for updating cover image
 */
export const useUpdateCoverImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ Organization: any }, Error, FormData>({
    mutationFn: (formData: FormData) => {
      return apiService.updateOrganisationCoverImage(formData);
    },
    onSuccess: () => {
      // Invalidate the cover image query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['coverImage'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cover image';
      console.error('Error updating cover image:', errorMessage);
    },
  });
};
