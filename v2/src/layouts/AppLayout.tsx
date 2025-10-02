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
import { useGetOrganisation, useGetOrgIdentity } from '@/custom-hooks/gettingStarted';
import { isPublicRoute } from '@/lib/apiService/utils';
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
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Helper to get current locale from path like /en/..., /fi/..., /sv/...
  const getLocaleFromPath = (p?: string | null) => {
    if (!p) return null;
    const match = p.match(/^\/(en|fi|sv)(?:\/|$)/);
    return match ? match[1] : null;
  };
  const getPathWithoutLocale = (p?: string | null) => {
    if (!p) return '/';
    const locale = getLocaleFromPath(p);
    if (!locale) return p || '/';
    const stripped = p.slice(locale.length + 1) || '/';
    return stripped;
  };
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const isOnOnboarding = pathWithoutLocale.startsWith('/onboarding');

  // Fetch organisation and org identity to gate onboarding after login
  const { data: orgRes, isLoading: orgLoading } = useGetOrganisation();
  const organisation = orgRes?.organisation;
  const orgId = organisation?.id || 'current';
  const { data: orgIdentity, isLoading: idLoading } = useGetOrgIdentity(orgId);
  // Helper to prefix a path with current locale if present
  const withLocale = (path: string) => {
    const locale = getLocaleFromPath(pathname);
    return locale ? `/${locale}${path}` : path;
  };
  const isSamePath = (target: string) => {
    const dest = withLocale(target);
    return pathname === dest;
  };
  const isPublicPath = (p?: string | null) => {
    const path = getPathWithoutLocale(p);
    for (const route of publicRoutes) {
      if (route === '/') {
        if (path === '/') return true;
        continue;
      }
      if (route.includes('[')) {
        const base = route.split('/[')[0];
        if (path === base || path.startsWith(base + '/')) return true;
        continue;
      }
      if (path === route || path.startsWith(route + '/')) return true;
    }
    return false;
  };
  
  // Only show toast when an error message is present. Suppress success toasts.
  useEffect(() => {
    // Proactively clear any success messages so they don't linger
    if (successMessage) {
      dispatch(setSuccessMessage(''));
    }
    if (errorMessage) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [successMessage, errorMessage, dispatch]);
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Clear the global success message so it doesn't re-open
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
        // - Allow staying on onboarding if org identity is not verified
        // - Redirect away from onboarding only when CoC is signed AND identity is verified
        if (!orgLoading && !idLoading) {
          const cocSigned = Boolean(organisation?.codeOfConduct);
          const isVerified = Boolean((orgIdentity as any)?.verified || (orgIdentity as any)?.organisationalIdentity?.verified);
          // Determine if current route is public (locale-aware)
          const inPublic = isPublicPath(pathname);
          // If CoC is not signed, only force redirect to onboarding when NOT on a public route
          if (!cocSigned && !isOnOnboarding && !inPublic) {
            router.replace(withLocale('/onboarding'));
            return;
          }
          if (cocSigned && isVerified && isOnOnboarding) {
            if (!isSamePath('/start')) router.replace(withLocale('/start'));
            return;
          }
          // If CoC is signed but identity not verified, allow user to stay on onboarding
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
  }, [isAuthenticated, isLoading, pathname, router, orgLoading, idLoading, organisation?.verificationRequestURLPrefix, organisation?.codeOfConduct, (orgIdentity as any)?.verified, (orgIdentity as any)?.organisationalIdentity?.verified]);
  
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
      {/* Global error message only using custom SnackbarComponent */}
      <SnackbarComponent
        open={showSuccess}
        setOpen={(open) => {
          if (!open) {
            handleCloseSuccess();
          } else {
            setShowSuccess(open);
          }
        }}
        message={errorMessage}
      />
      
      {currentLayout === 'main' ? 
        <MainLayout>{children}</MainLayout> : 
        <MinimalLayout>{children}</MinimalLayout>}
    </>
  );
};

export default AppLayout;
