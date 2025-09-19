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
import { isPublicRoute } from '@/lib/apiService/utils';

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
  // Helper to prefix a path with current locale if present
  const withLocale = (path: string) => {
    const locale = getLocaleFromPath(pathname);
    return locale ? `/${locale}${path}` : path;
  };
  const isSamePath = (target: string) => {
    const dest = withLocale(target);
    return pathname === dest;
  };
  const getPathWithoutLocale = (p?: string | null) => {
    if (!p) return '/';
    const locale = getLocaleFromPath(p);
    if (!locale) return p || '/';
    const stripped = p.slice(locale.length + 1) || '/';
    return stripped;
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

      // Always render auth routes with MinimalLayout to avoid flicker/remount
      if (isAuthPath) {
        setCurrentLayout('minimal');
        // Do not redirect here; login/signup flows handle navigation
        return;
      }

      if (isAuthenticated) {
        setCurrentLayout('main');
        // Do not redirect here; let login flow handle navigation to avoid flicker
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
  }, [isAuthenticated, pathname, router]);
  
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
