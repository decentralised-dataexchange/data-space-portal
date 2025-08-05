import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminDetails {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  adminDetails: AdminDetails | null;
  loading: boolean;
  error: boolean;
  message: string;
  successMessage: string;
}

// Helper function to check if token exists and is valid
const checkInitialAuthState = (): boolean => {
  // Always return false for initial server-side rendering
  // The actual state will be determined client-side in AuthProvider
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for access token in cookies first (more reliable for SSR)
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='));
      
    if (cookieToken) {
      return true;
    }
    
    // Fallback to localStorage
    const accessToken = localStorage.getItem('access_token');
    return !!accessToken;
  } catch (e) {
    console.error('Error checking token:', e);
    return false;
  }
};

const initialState: AuthState = {
  isAuthenticated: checkInitialAuthState(),
  adminDetails: null,
  loading: false,
  message: "",
  error: false,
  successMessage: ""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAdminDetails: (state, action: PayloadAction<AdminDetails>) => {
      state.adminDetails = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.adminDetails = null;
      state.error = false;
      state.message = '';
      if (typeof window !== 'undefined') {
        // Clear tokens in new format
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_in');
        localStorage.removeItem('refresh_expires_in');
        localStorage.removeItem('token_type');
        localStorage.removeItem('User');
      }
    }
  }
});

export const { 
  setAuthenticated, 
  setAdminDetails, 
  setLoading, 
  setError, 
  setMessage, 
  setSuccessMessage,
  logout 
} = authSlice.actions;

/**
 * Action creator that handles both Redux logout and React Query reset
 * This should be used instead of the plain logout action when you need to clear React Query cache
 */
export const logoutAndClearState = () => {
  return (dispatch: any) => {
    // Dispatch the Redux logout action
    dispatch(logout());
    
    // Clear localStorage and cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_in');
      localStorage.removeItem('refresh_expires_in');
      localStorage.removeItem('token_type');
      localStorage.removeItem('User');
    }
  };
};

export default authSlice.reducer;
