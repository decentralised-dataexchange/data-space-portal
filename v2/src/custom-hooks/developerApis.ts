import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch } from './store';
import { LocalStorageService } from '@/utils/localStorageService';

// Hook to get admin details
export const useGetAdminDetails = () => {
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
  });
};

// Hook to get organization details
export const useGetOrganizationDetails = () => {
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
