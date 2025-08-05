import React from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import '../style.scss';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginRoute = pathname.includes('/login');
  return (
    <>
      {isLoginRoute ? null : <MinimalAppBar />}
      <Box className="leftNavigationContainer">
        <Box component="main">
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