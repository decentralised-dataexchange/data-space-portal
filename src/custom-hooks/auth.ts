import { useMutation, useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import { useAppDispatch } from "./store";
import { setAdminDetails, setAuthenticated, setMessage, setSuccessMessage } from "@/store/reducers/authReducer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorageService } from "@/utils/localStorageService";
import { AccessToken, SignupPayload, LoginResponse, MfaRequiredResponse, LoginTokenResponse } from "@/types/auth";

declare module "@/lib/apiService/apiService" {
  interface ApiService {
    login: (email: string, password: string) => Promise<LoginResponse>;
    signup: (payload: SignupPayload) => Promise<any>;
    getAdminDetails: () => Promise<any>;
  }
}

function isMfaRequired(data: LoginResponse): data is MfaRequiredResponse {
  return 'mfa_required' in data && data.mfa_required === true;
}

/** Store tokens and navigate to /start after successful authentication */
function handleAuthSuccess(
  data: LoginTokenResponse,
  dispatch: ReturnType<typeof useAppDispatch>,
  router: ReturnType<typeof useRouter>,
) {
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

  setTimeout(() => {
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : null;
      const match = path ? path.match(/^\/(en|fi|sv)(?:\/|$)/) : null;
      const localizedStart = match ? `/${match[1]}/start` : '/start';
      router.replace(localizedStart);
    } catch {
      router.replace('/start');
    }
  }, 0);

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
}

function extractErrorText(error: unknown, fallback: string): string {
  try {
    const anyErr = error as any;
    const data = anyErr?.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (anyErr?.message) return anyErr.message;
  } catch {}
  return fallback;
}

// Login hook
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutate, isSuccess, isPending, error, data } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return apiService.login(email, password);
    },
    onSuccess: async (data) => {
      if (isMfaRequired(data)) {
        // MFA required — clear errors but don't navigate or store tokens.
        // The component reads `data.mfa_required` to show the verification UI.
        dispatch(setMessage(''));
        return;
      }

      // Normal (non-MFA) login — store tokens and navigate
      handleAuthSuccess(data, dispatch, router);
    },
    onError: (error: unknown) => {
      dispatch(setSuccessMessage(''));
      dispatch(setMessage(extractErrorText(error, 'Login failed')));
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

// MFA verify hook
export const useMfaVerify = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutate, isPending, isSuccess, error, data } = useMutation({
    mutationFn: ({ session_token, code }: { session_token: string; code: string }) => {
      return apiService.mfaVerify({ session_token, code });
    },
    onSuccess: (data) => {
      handleAuthSuccess(data, dispatch, router);
    },
    onError: (error: unknown) => {
      dispatch(setSuccessMessage(''));
      dispatch(setMessage(extractErrorText(error, 'Verification failed')));
    }
  });

  return {
    verify: mutate,
    isLoading: isPending,
    success: isSuccess,
    error,
    data
  };
};

// MFA resend hook
export const useMfaResend = () => {
  const dispatch = useAppDispatch();

  const { mutate, isPending, isSuccess, error, data } = useMutation({
    mutationFn: ({ session_token }: { session_token: string }) => {
      return apiService.mfaResend({ session_token });
    },
    onSuccess: (data) => {
      dispatch(setMessage(''));
      dispatch(setSuccessMessage(data.detail));
    },
    onError: (error: unknown) => {
      dispatch(setSuccessMessage(''));
      dispatch(setMessage(extractErrorText(error, 'Failed to resend code')));
    }
  });

  return {
    resend: mutate,
    isLoading: isPending,
    success: isSuccess,
    error,
    data
  };
};

// Signup hook
export const useSignup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutate, isPending, isSuccess, error, data } = useMutation({
    mutationFn: (payload: SignupPayload) => {
      return apiService.signup(payload);
    },
    onSuccess: () => {
      // Clear any previous messages and suppress success toast
      dispatch(setMessage(''));
      dispatch(setSuccessMessage(''));
      // Navigate to login
      setTimeout(() => {
        try {
          const path = typeof window !== 'undefined' ? window.location.pathname : null;
          const match = path ? path.match(/^\/(en|fi|sv)(?:\/|$)/) : null;
          const localizedLogin = match ? `/${match[1]}/login` : '/login';
          router.replace(localizedLogin);
        } catch {
          router.replace('/login');
        }
      }, 0);
    },
    onError: (error: unknown) => {
      let errText = 'Signup failed';
      try {
        const anyErr = error as any;
        const data = anyErr?.response?.data;
        if (typeof data === 'string') errText = data;
        else if (data?.detail) errText = data.detail;
        else if (data?.message) errText = data.message;
        else if (data?.email?.length) errText = data.email.join(", ");
        else if (anyErr?.message) errText = anyErr.message;
      } catch {}
      dispatch(setSuccessMessage(''));
      dispatch(setMessage(errText));
    }
  });

  return {
    signup: mutate,
    isLoading: isPending,
    success: isSuccess,
    error,
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
