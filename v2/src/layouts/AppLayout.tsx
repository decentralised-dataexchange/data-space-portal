"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from './main/MainLayout';
import MinimalLayout from './minimal/MinimalLayout';
import { useAppSelector } from '@/custom-hooks/store';
import Loader from '@/components/common/Loader';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const [currentLayout, setCurrentLayout] = useState<'main' | 'minimal'>('minimal');
  
  // Effect to update layout when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentLayout('main');
    } else {
      setCurrentLayout('minimal');
    }
  }, [isAuthenticated]);
  
  // Show loading state if still checking authentication
  if (isLoading) {
    return <MinimalLayout><Loader /></MinimalLayout>;
  }

  // Render the appropriate layout based on authentication state
  return currentLayout === 'main' ? 
    <MainLayout>{children}</MainLayout> : 
    <MinimalLayout>{children}</MinimalLayout>;
};

export default AppLayout;
