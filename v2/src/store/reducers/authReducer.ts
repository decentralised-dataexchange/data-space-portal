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
}

// Helper function to check if token exists and is valid
const checkInitialAuthState = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for access token in the new format
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
  error: false
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
  logout 
} = authSlice.actions;

export default authSlice.reducer;
