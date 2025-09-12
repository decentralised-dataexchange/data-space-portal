"use client";

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import MainAppBar from '@/components/common/AppBar/MainAppBar';
import Footer from '@/components/common/Footer';
import SideBar from '@/components/common/SideBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import '../style.scss';
import { usePathname } from 'next/navigation';
import { isPublicRoute } from '@/lib/apiService/utils';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleOpenMenu = () => {
    setOpen(!open);
  };

  const inPublicRoute = useMemo(() => isPublicRoute(pathname), [pathname]);
  const isLoginRoute = pathname.includes('/login');

  // Close sidebar on route change for non-desktop (temporary drawer overlay)
  useEffect(() => {
    if (!isDesktop && open) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {isLoginRoute ? null : <MainAppBar handleOpenMenu={handleOpenMenu} />}
      <Box className="leftNavigationContainer" sx={{ 
        marginLeft: isDesktop && open ? '260px' : 0, 
        transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
      }}>
        <SideBar open={open} handleDrawerClose={handleOpenMenu} />
        <Box 
          component="main" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 'calc(100vh - 80px)',
            // '& > *:first-child': {
            //   marginLeft: '15px', // Match container padding
            //   marginBottom: '1rem',
            //   marginTop: '10px' // Original top spacing
            // }
          }}
        >
          <Suspense fallback={null}>
            <Breadcrumb />
          </Suspense>
          {children}
        </Box>
        <Box className="footerContainer d-flex-center">
          <Footer txt={'v2024.03.1'} />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
