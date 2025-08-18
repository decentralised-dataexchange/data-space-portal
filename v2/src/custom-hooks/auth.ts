import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch } from "./store";
import { setAdminDetails, setAuthenticated, setMessage, setSuccessMessage } from "@/store/reducers/authReducer";
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
      // Clear any previous global error to avoid showing error after success
      dispatch(setMessage(''));
      // Set a global success message so AppLayout can show a toast after navigation
      dispatch(setSuccessMessage('Login successful'));
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
      // Send a global error message so AppLayout can display it
      let errText = 'Login failed';
      // Try to extract a server-provided message
      try {
        const anyErr = error as any;
        const data = anyErr?.response?.data;
        if (typeof data === 'string') errText = data;
        else if (data?.detail) errText = data.detail;
        else if (anyErr?.message) errText = anyErr.message;
      } catch {}
      dispatch(setSuccessMessage(''));
      dispatch(setMessage(errText));
      // dispatch(setLoading(false));
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
