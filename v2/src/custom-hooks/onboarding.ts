import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import type { SectorsResponse } from "@/types/onboarding";
import type { SignupPayload, AccessToken } from "@/types/auth";
import { useAppDispatch } from "./store";
import { setAuthenticated, setMessage, setSuccessMessage, setAdminDetails } from "@/store/reducers/authReducer";
import { LocalStorageService } from "@/utils/localStorageService";

export const useSectors = () => {
  return useQuery<SectorsResponse>({
    queryKey: ['sectorsPublic'],
    queryFn: () => apiService.getSectorsPublic(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useOnboardingSignup = () => {
  return useMutation({
    mutationFn: (payload: SignupPayload) => apiService.signup(payload),
  });
};

export const useSilentLogin = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => apiService.login(email, password),
    onSuccess: async (data) => {
      const token: AccessToken = {
        access_token: data.access,
        refresh_token: data.refresh,
        expires_in: 3600,
        refresh_expires_in: 86400,
        token_type: 'Bearer'
      };
      LocalStorageService.updateToken(token);
      dispatch(setAuthenticated(true));
      dispatch(setMessage(''));
      dispatch(setSuccessMessage(''));
      // fetch admin details non-blocking
      setTimeout(() => {
        apiService.getAdminDetails()
          .then(userData => {
            if (userData) {
              LocalStorageService.updateUser(userData);
              dispatch(setAdminDetails(userData));
            }
          })
          .catch(() => {});
      }, 0);
    },
    onError: () => {
      dispatch(setSuccessMessage(''));
      dispatch(setMessage('Login failed'));
    }
  });
};
