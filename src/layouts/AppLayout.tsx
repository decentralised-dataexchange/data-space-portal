"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MainLayout from './main/MainLayout';
import MinimalLayout from './minimal/MinimalLayout';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/store';
import Loader from '@/components/common/Loader';
import SnackbarComponent from '@/components/notification';
import { setSuccessMessage, setMessage } from '@/store/reducers/authReducer';
import { publicRoutes } from '@/constants/routes';
import { useGetOrganisation } from '@/custom-hooks/gettingStarted';
import { isPublicRoute, getLocaleFromPathname, getPathnameWithoutLocale } from '@/lib/apiService/utils';
import { LocalStorageService } from '@/utils/localStorageService';
import { jwtDecode } from 'jwt-decode';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const successMessage = useAppSelector((state) => state.auth.successMessage);
  const errorMessage = useAppSelector((state) => state.auth.message);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [currentLayout, setCurrentLayout] = useState<'main' | 'minimal'>('minimal');
  const [isClient, setIsClient] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  const isOnOnboarding = pathWithoutLocale.startsWith('/onboarding');

  // Fetch organisation to gate onboarding after login
  const { data: orgRes, isLoading: orgLoading } = useGetOrganisation();
  const organisation = orgRes?.organisation;
  // Helper to prefix a path with current locale if present
  const withLocale = (path: string) => {
    const locale = getLocaleFromPathname(pathname);
    return locale ? `/${locale}${path}` : path;
  };
  const isSamePath = (target: string) => {
    const dest = withLocale(target);
    return pathname === dest;
  };
  const isPublicPath = (p?: string | null) => {
    if (!p) return false;
    return isPublicRoute(p);
  };
  
  // Show toast when either success or error message is present
  useEffect(() => {
    if (successMessage || errorMessage) {
      setOpenSnackbar(true);
    } else {
      setOpenSnackbar(false);
    }
  }, [successMessage, errorMessage]);
  
  const handleCloseSuccess = () => {
    setOpenSnackbar(false);
    // Clear any global messages so it doesn't re-open
    dispatch(setSuccessMessage(''));
    dispatch(setMessage(''));
  };
  
  // Effect to handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Check client-side auth state relying solely on Redux auth
    const checkClientAuth = () => {
      const isAuthPath = !!pathname && (pathname.includes('/login') || pathname.includes('/signup'));
      const inPublicRoute = !!pathname && isPublicRoute(pathname);

      // Always render auth routes with MinimalLayout. If already authenticated, redirect to /start.
      // Guard against logout race: only redirect when a token is still present.
      if (isAuthPath) {
        setCurrentLayout('minimal');
        // Only redirect when auth check is complete, user is authenticated, and token is valid (unexpired)
        const hasValidToken = (() => {
          try {
            if (typeof window === 'undefined') return false;
            const tokenObj: any = (LocalStorageService as any)?.getToken?.();
            const access = (tokenObj && tokenObj.access_token) || window.localStorage.getItem('access_token');
            if (!access) return false;
            const decoded: any = jwtDecode(access);
            if (!decoded?.exp) return false;
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp > now;
          } catch { return false; }
        })();
        const hasUserProfile = (() => {
          try {
            if (typeof window === 'undefined') return false;
            const user = (LocalStorageService as any)?.getUser?.();
            return Boolean(user && (user as any).email);
          } catch { return false; }
        })();
        if (!isLoading && isAuthenticated && hasValidToken && hasUserProfile && !isSamePath('/start')) {
          router.replace(withLocale('/start'));
        }
        return;
      }

      if (isAuthenticated) {
        // Use minimal layout (no navbar) on onboarding pages
        setCurrentLayout(isOnOnboarding ? 'minimal' : 'main');
        // Onboarding gating:
        // - Redirect to onboarding if Code of Conduct not signed
        // - Identity verification is optional and can be completed from the /start page
        if (!orgLoading) {
          const cocSigned = Boolean(organisation?.codeOfConduct);
          // Determine if current route is public (locale-aware)
          const inPublic = isPublicPath(pathname);
          // If CoC is not signed, force redirect to onboarding when NOT on a public route
          if (!cocSigned && !isOnOnboarding && !inPublic) {
            router.replace(withLocale('/onboarding'));
            return;
          }
          if (cocSigned && isOnOnboarding) {
            if (!isSamePath('/start')) router.replace(withLocale('/start'));
            return;
          }
        }
        return;
      }

      // Not authenticated: ensure minimal layout
      setCurrentLayout('minimal');
      // Only redirect to login if not on a public route
      if (!inPublicRoute && !isSamePath('/login')) {
        router.replace(withLocale('/login'));
      }
    };
    
    checkClientAuth();
  }, [isAuthenticated, isLoading, pathname, router, orgLoading, organisation?.codeOfConduct]);
  
  // Show loading state during server-side rendering
  if (!isClient) {
    return <MinimalLayout><Loader /></MinimalLayout>;
  }
  
  // Show loading state if still checking authentication
  if (isLoading) {
    return <MinimalLayout><Loader /></MinimalLayout>;
  }

  // Render the appropriate layout based on authentication state
  return (
    <>
      {/* Global message using custom SnackbarComponent */}
      <SnackbarComponent
        open={openSnackbar}
        setOpen={(open) => {
          if (!open) {
            handleCloseSuccess();
          } else {
            setOpenSnackbar(open);
          }
        }}
        message={successMessage || errorMessage}
        type={successMessage ? 'success' : 'error'}
      />
      
      {currentLayout === 'main' ? 
        <MainLayout>{children}</MainLayout> : 
        <MinimalLayout>{children}</MinimalLayout>}
    </>
  );
};

export default AppLayout;
