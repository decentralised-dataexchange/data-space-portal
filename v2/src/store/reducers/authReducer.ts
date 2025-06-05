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
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('Token') : false,
  adminDetails: null,
  loading: false,
  error: null
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.adminDetails = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('Token');
        localStorage.removeItem('RefreshToken');
      }
    }
  }
});

export const { 
  setAuthenticated, 
  setAdminDetails, 
  setLoading, 
  setError,
  logout 
} = authSlice.actions;

export default authSlice.reducer;
