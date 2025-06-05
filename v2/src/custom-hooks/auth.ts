import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch } from "./store";
import { setAdminDetails, setAuthenticated, setError, setLoading } from "@/store/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Update apiService with login and admin details methods
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

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      dispatch(setLoading(true));
      return apiService.login(email, password);
    },
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem("Token", JSON.stringify(data.access));
      localStorage.setItem("RefreshToken", JSON.stringify(data.refresh));
      
      // Update auth state
      dispatch(setAuthenticated(true));
      dispatch(setLoading(false));
      dispatch(setError(null));
      
      // Redirect to start page
      router.push('/');
    },
    onError: (error: any) => {
      dispatch(setLoading(false));
      dispatch(setError(error?.response?.data?.detail || "Login failed"));
    }
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error
  };
};

// Get admin details hook
export const useGetAdminDetails = () => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminDetails'],
    queryFn: () => apiService.getAdminDetails(),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('Token')
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
