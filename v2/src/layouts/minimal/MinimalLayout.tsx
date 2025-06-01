import React from 'react';
import MinimalAppBar from '@/components/common/AppBar/MinimalAppBar';
import Box from '@mui/material/Box';
import Footer from '@/components/common/Footer';
import { theme } from '@/theme';
import '../style.scss';

const Layout = ({ children }: { children: React.ReactNode }) => {

  const drawerWidth = 260;
  const open = false;

  const mainSx = {
    fontFamily: `"Roboto", sans-serif`,
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '100px',
    marginLeft: `-${drawerWidth}px`,
    width: '100%',
    ...(open
      ? {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
          width: `calc(100% - ${drawerWidth}px)`,
        }
      : {}),
  };

  return (
    <>
      <MinimalAppBar />
      <Box className="leftNavigationContainer">
        <Box component="main" className="appBar" sx={mainSx}>
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