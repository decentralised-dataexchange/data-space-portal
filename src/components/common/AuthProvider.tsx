"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '@/utils/localStorageService';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/store';
import { setAuthenticated, setAdminDetails, logout as logoutAction, setLoading as setAuthLoading } from '@/store/reducers/authReducer';
import { useQueryClient } from '@tanstack/react-query';
import { clearAllBrowserStorage } from '@/utils/browserStorage';
import { setAxiosAuthState } from '@/lib/apiService/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: any, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Import public routes from shared constants
import { publicRoutes } from '@/constants/routes';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Use Redux state as the source of truth
  const { isAuthenticated: reduxIsAuthenticated, loading: reduxIsLoading } = useAppSelector(state => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(reduxIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  // Keep local state in sync with Redux state
  useEffect(() => {
    setIsAuthenticated(reduxIsAuthenticated);
  }, [reduxIsAuthenticated]);


  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Signal Redux that auth check is in progress to gate client redirects
        dispatch(setAuthLoading(true));
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false);
          dispatch(setAuthLoading(false));
          return;
        }
        
        // Get token from LocalStorageService
        const token = LocalStorageService.getToken();
        
        if (!token || !token.access_token) {
          setIsAuthenticated(false);
          dispatch(setAuthenticated(false));
          try { setAxiosAuthState(false); } catch {}
          setIsLoading(false);
          dispatch(setAuthLoading(false));
          return;
        }
        
        // Get the access token string
        const accessToken = token.access_token;
        
        if (!accessToken) {
          LocalStorageService.clear();
          setIsAuthenticated(false);
          dispatch(setAuthenticated(false));
          try { setAxiosAuthState(false); } catch {}
          setIsLoading(false);
          dispatch(setAuthLoading(false));
          return;
        }
        
        // Verify token expiration
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          
          if ((decodedToken as any).exp < currentTime) {
            // Token expired
            LocalStorageService.clear();
            setIsAuthenticated(false);
            dispatch(setAuthenticated(false));
            try { setAxiosAuthState(false); } catch {}
            setIsLoading(false);
            dispatch(setAuthLoading(false));
            return;
          }
          
          // Token is valid, update Redux state
          dispatch(setAuthenticated(true));
          try { setAxiosAuthState(true); } catch {}
          
          // Get admin details if available
          try {
            const user = LocalStorageService.getUser();
            if (user) {
              dispatch(setAdminDetails(user));
            }
          } catch (error) {
            console.error('Error getting user details:', error);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          LocalStorageService.clear();
          setIsAuthenticated(false);
          dispatch(setAuthenticated(false));
          try { setAxiosAuthState(false); } catch {}
        }
        
        setIsLoading(false);
        dispatch(setAuthLoading(false));
      } catch (error) {
        console.error('Auth check error:', error);
        LocalStorageService.clear();
        setIsAuthenticated(false);
        dispatch(setAuthenticated(false));
        try { setAxiosAuthState(false); } catch {}
        setIsLoading(false);
        dispatch(setAuthLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  const login = (token: any, userData: any) => {
    // First update storage
    LocalStorageService.updateToken(token);
    LocalStorageService.updateUser(userData);
    
    // Then update Redux (source of truth)
    dispatch(setAuthenticated(true));
    dispatch(setAdminDetails(userData));
    // Allow axios requests
    try { setAxiosAuthState(true); } catch {}
    
    // Local state will be updated via the useEffect that watches reduxIsAuthenticated
  };

  const logout = () => {
    // Block axios requests immediately
    try { setAxiosAuthState(false); } catch {}

    // Update Redux (source of truth) ASAP so queries gated by isAuthenticated stop
    dispatch(logoutAction());

    // Cancel any in-flight queries next
    try { queryClient.cancelQueries(); } catch {}

    // Clear React Query cache to avoid stale data leakage between sessions
    try {
      queryClient.clear();
    } catch {}

    // Clear auth cookies and storage synchronously to avoid middleware seeing stale tokens
    try { LocalStorageService.clear(); } catch {}
    // Then do best-effort background cleanup (caches, indexedDB, etc.)
    try { void clearAllBrowserStorage(); } catch {}

    // Finally redirect
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : null;
      const match = path ? path.match(/^\/(en|fi|sv)(?:\/|$)/) : null;
      const localizedLogin = match ? `/${match[1]}/login` : '/login';
      router.replace(localizedLogin);
    } catch {
      router.replace('/login');
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
