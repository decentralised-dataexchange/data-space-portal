import React from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import '../style.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {

  const drawerWidth = 260;
  const open = false;

  // Use className instead of sx with theme functions to avoid client/server component issues

  return (
    <>
      <MinimalAppBar />
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