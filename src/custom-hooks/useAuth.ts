"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from '@/utils/localStorageService';
import { useAppDispatch } from './store';
import { setAuthenticated, setAdminDetails } from '@/store/reducers/authReducer';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if token exists in localStorage
        const tokenString = localStorage.getItem('access_token');
        if (!tokenString) {
          setIsAuthenticatedState(false);
          dispatch(setAuthenticated(false));
          setIsLoading(false);
          return false;
        }

        // Parse token and check expiration
        const token = JSON.parse(tokenString);
        const accessToken = token.access_token;
        if (!accessToken) {
          LocalStorageService.clear();
          dispatch(setAuthenticated(false));
          setIsAuthenticatedState(false);
          setIsLoading(false);
          return false;
        }
        
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        
        if ((decodedToken as any).exp < currentTime) {
          // Token expired
          LocalStorageService.clear();
          dispatch(setAuthenticated(false));
          setIsAuthenticatedState(false);
          setIsLoading(false);
          return false;
        }

        // Valid token, set authenticated state
        dispatch(setAuthenticated(true));
        setIsAuthenticatedState(true);
        
        // Get user details if available
        try {
          const user = LocalStorageService.getUser();
          if (user) {
            dispatch(setAdminDetails(user));
          }
        } catch (error) {
          console.error('Error getting user details:', error);
        }
        
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        LocalStorageService.clear();
        dispatch(setAuthenticated(false));
        setIsAuthenticatedState(false);
        setIsLoading(false);
        return false;
      }
    };

    checkAuth();
  }, [dispatch, router]);

  return { isAuthenticated, isLoading };
};

export default useAuth;
