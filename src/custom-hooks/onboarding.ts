import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import type { SectorsResponse } from "@/types/onboarding";
import type { SignupPayload, AccessToken, LoginTokenResponse } from "@/types/auth";
import { useAppDispatch } from "./store";
import { setAuthenticated, setMessage, setSuccessMessage, setAdminDetails } from "@/store/reducers/authReducer";
import { LocalStorageService } from "@/utils/localStorageService";
import { setAxiosAuthState } from "@/lib/apiService/axios";

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
      // If MFA is required, silent login cannot complete — treat as failure
      if ('mfa_required' in data && data.mfa_required) {
        dispatch(setSuccessMessage(''));
        dispatch(setMessage('MFA verification required. Please log in manually.'));
        return;
      }

      const tokenData = data as LoginTokenResponse;
      const token: AccessToken = {
        access_token: tokenData.access,
        refresh_token: tokenData.refresh,
        expires_in: 3600,
        refresh_expires_in: 86400,
        token_type: 'Bearer'
      };
      // Use LocalStorageService which properly sets cookies including client_auth
      LocalStorageService.updateToken(token);

      // Update Redux state
      dispatch(setAuthenticated(true));
      dispatch(setMessage(''));
      dispatch(setSuccessMessage(''));

      // Enable axios auth state so API requests can proceed
      try { setAxiosAuthState(true); } catch {}

      // Fetch admin details non-blocking
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
