import React, { Suspense } from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import '../style.scss';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import { APP_VERSION } from '@/constants/version';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/signup');
  const isOnboardingRoute = pathname.includes('/onboarding');
  return (
    <>
      {/* Hide app bar on onboarding and auth routes */}
      {isAuthRoute || isOnboardingRoute ? null : <MinimalAppBar />}
      <Box className="leftNavigationContainer">
        <Box component="main" sx={{ paddingTop: (isAuthRoute || isOnboardingRoute) ? 0 : '80px', flex: 1, backgroundColor: isAuthRoute ? '#FFFFFF' : 'transparent' }}>
          {!isAuthRoute && !isOnboardingRoute && (
            <Suspense fallback={null}>
              <Breadcrumb />
            </Suspense>
          )}
          {children}
        </Box>
        <Box className="footerContainer d-flex-center">
          <Footer txt={APP_VERSION} />
        </Box>
      </Box>
    </>
  );
}

export default Layout;