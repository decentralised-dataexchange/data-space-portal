import React from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import '../style.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {

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