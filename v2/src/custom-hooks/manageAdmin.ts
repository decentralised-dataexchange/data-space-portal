import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch } from './store';

// Query key constants
export const ADMIN_QUERY_KEYS = {
  ADMIN_DETAILS: 'adminDetails',
};

/**
 * Hook to fetch admin details
 */
export const useGetAdminDetails = () => {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: [ADMIN_QUERY_KEYS.ADMIN_DETAILS],
    queryFn: async () => {
      try {
        const data = await apiService.getAdminDetails();
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch admin details';
        throw error;
      }
    },
  });
};

/**
 * Hook to update admin details
 */
export const useUpdateAdminDetails = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (payload: { name: string }) => apiService.updateAdminDetails(payload),
    onSuccess: () => {
      // Invalidate admin details query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEYS.ADMIN_DETAILS] });
    },
  });
};

/**
 * Hook to reset admin password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: { 
      old_password: string;
      new_password1: string;
      new_password2: string;
    }) => apiService.passwordReset(payload),
  });
};
