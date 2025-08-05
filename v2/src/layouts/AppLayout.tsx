"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from './main/MainLayout';
import MinimalLayout from './minimal/MinimalLayout';
import { useAppSelector } from '@/custom-hooks/store';
import Loader from '@/components/common/Loader';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const successMessage = useAppSelector((state) => state.auth.successMessage);
  const [currentLayout, setCurrentLayout] = useState<'main' | 'minimal'>('minimal');
  const [isClient, setIsClient] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Show success message when it changes
  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
    }
  }, [successMessage]);
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  
  // Effect to handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Check client-side auth state
    const checkClientAuth = () => {
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
  }, [isAuthenticated]);
  
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
      {/* Global success message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ top: 100 }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      
      {currentLayout === 'main' ? 
        <MainLayout>{children}</MainLayout> : 
        <MinimalLayout>{children}</MinimalLayout>}
    </>
  );
};

export default AppLayout;
