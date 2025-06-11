import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch } from "./store";
import { setAdminDetails, setAuthenticated, setError, setMessage, setLoading } from "@/store/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorageService } from "@/utils/localStorageService";
import { AccessToken } from "@/types/auth";

declare module "@/lib/apiService/apiService" {
  interface ApiService {
    login: (email: string, password: string) => Promise<{ access: string; refresh: string }>;
    getAdminDetails: () => Promise<any>;
  }
}

// Login hook
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutate, isSuccess, isPending, error, data } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      // dispatch(setLoading(true));
      return apiService.login(email, password);
    },
    onSuccess: async (data) => {
      // Store tokens using LocalStorageService (which also sets cookies)
      const token: AccessToken = {
        access_token: data.access,
        refresh_token: data.refresh,
        expires_in: 3600, // Default expiration time
        refresh_expires_in: 86400, // Default refresh expiration time
        token_type: 'Bearer'
      };

      // First update the token in localStorage and cookies
      LocalStorageService.updateToken(token);

      // Update auth state in Redux immediately
      dispatch(setAuthenticated(true));
      // dispatch(setLoading(false));
      
      // Delay navigation to allow notification to be seen
      setTimeout(() => {
        router.push('/start');
      }, 0);

      // Then fetch admin details in the background (non-blocking)
      setTimeout(() => {
        apiService.getAdminDetails()
          .then(userData => {
            if (userData) {
              LocalStorageService.updateUser(userData);
              dispatch(setAdminDetails(userData));
            }
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
          });
      }, 500);
    },
    onError: (error: unknown) => {
      // dispatch(setLoading(false));
      // Error handling is now done in the component using the returned error
    }
  });

  return {
    login: mutate,
    error: error,
    success: isSuccess,
    isLoading: isPending,
    data
  };
};

// Get admin details hook
export const useGetAdminDetails = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminDetails'],
    queryFn: () => apiService.getAdminDetails(),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('access_token')
  });

  useEffect(() => {
    if (data) {
      dispatch(setAdminDetails(data));
    }
  }, [data, dispatch]);

  return {
    adminDetails: data,
    isLoading,
    isError
  };
};
