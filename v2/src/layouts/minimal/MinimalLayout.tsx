import React, { Suspense } from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import '../style.scss';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginRoute = pathname.includes('/login');
  return (
    <>
      {isLoginRoute ? null : <MinimalAppBar />}
      <Box className="leftNavigationContainer">
        <Box component="main" sx={{ paddingTop: isLoginRoute ? 0 : '80px', flex: 1 }}>
          {!isLoginRoute && (
            <Suspense fallback={null}>
              <Breadcrumb />
            </Suspense>
          )}
          {children}
        </Box>
        <Box className="footerContainer d-flex-center">
          <Footer txt={'v2024.03.1'} />
        </Box>
      </Box>
    </>
  );
}

export default Layout;