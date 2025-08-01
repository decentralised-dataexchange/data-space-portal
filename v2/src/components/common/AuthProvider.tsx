"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '@/utils/localStorageService';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/store';
import { setAuthenticated, setAdminDetails } from '@/store/reducers/authReducer';

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
  
  // Keep local state in sync with Redux state
  useEffect(() => {
    setIsAuthenticated(reduxIsAuthenticated);
  }, [reduxIsAuthenticated]);


  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }
        
        // Get token from LocalStorageService
        const token = LocalStorageService.getToken();
        
        if (!token || !token.access_token) {
          setIsAuthenticated(false);
          dispatch(setAuthenticated(false));
          setIsLoading(false);
          return;
        }
        
        // Get the access token string
        const accessToken = token.access_token;
        
        if (!accessToken) {
          LocalStorageService.clear();
          setIsAuthenticated(false);
          dispatch(setAuthenticated(false));
          setIsLoading(false);
          return;
        }
        
        // Verify token expiration
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          
          if ((decodedToken as any).exp < currentTime) {
            // Token expired
            console.log('Token expired, logging out');
            LocalStorageService.clear();
            setIsAuthenticated(false);
            dispatch(setAuthenticated(false));
            setIsLoading(false);
            return;
          }
          
          // Token is valid, update Redux state
          console.log('Token is valid, setting authenticated state');
          dispatch(setAuthenticated(true));
          
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
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        LocalStorageService.clear();
        setIsAuthenticated(false);
        dispatch(setAuthenticated(false));
        setIsLoading(false);
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
    
    // Local state will be updated via the useEffect that watches reduxIsAuthenticated
  };

  const logout = () => {
    // First clear storage
    LocalStorageService.clear();
    
    // Then update Redux (source of truth)
    dispatch(setAuthenticated(false));
    
    // Local state will be updated via the useEffect that watches reduxIsAuthenticated
    
    // Finally redirect
    router.push('/login');
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
