"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from './main/MainLayout';
import MinimalLayout from './minimal/MinimalLayout';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/store';
import Loader from '@/components/common/Loader';
import SnackbarComponent from '@/components/notification';
import { setSuccessMessage, setMessage } from '@/store/reducers/authReducer';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const successMessage = useAppSelector((state) => state.auth.successMessage);
  const errorMessage = useAppSelector((state) => state.auth.message);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [currentLayout, setCurrentLayout] = useState<'main' | 'minimal'>('minimal');
  const [isClient, setIsClient] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Show toast when success or error message changes
  useEffect(() => {
    if (successMessage || errorMessage) {
      setShowSuccess(true);
    }
  }, [successMessage, errorMessage]);
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Clear the global success message so it doesn't re-open
    dispatch(setSuccessMessage(''));
    dispatch(setMessage(''));
  };
  
  // Effect to handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Check client-side auth state
    const checkClientAuth = () => {
      // Always use MinimalLayout on the login route to avoid layout flip/remount
      if (pathname && pathname.includes('/login')) {
        setCurrentLayout('minimal');
        return;
      }

      if (isAuthenticated) {
        setCurrentLayout('main');
        return;
      }
      
      // Only access browser APIs after hydration
      try {
        const hasToken = typeof window !== 'undefined' && 
                        (document.cookie.includes('access_token=') || 
                        localStorage.getItem('access_token'));
                        
        if (hasToken) {
          setCurrentLayout('main');
        } else {
          setCurrentLayout('minimal');
        }
      } catch (e) {
        console.error('Error checking client auth:', e);
        setCurrentLayout('minimal');
      }
    };
    
    checkClientAuth();
  }, [isAuthenticated, pathname]);
  
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
      {/* Global success message using custom SnackbarComponent */}
      <SnackbarComponent
        open={showSuccess}
        setOpen={(open) => {
          if (!open) {
            handleCloseSuccess();
          } else {
            setShowSuccess(open);
          }
        }}
        successMessage={successMessage}
        message={!successMessage ? errorMessage : undefined}
      />
      
      {currentLayout === 'main' ? 
        <MainLayout>{children}</MainLayout> : 
        <MinimalLayout>{children}</MinimalLayout>}
    </>
  );
};

export default AppLayout;
