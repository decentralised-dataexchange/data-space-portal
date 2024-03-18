
import React, { useEffect, useState } from 'react';
import AppBar  from '../AppBar';
import { useLocation } from 'react-router-dom';
import MenuBar from '../SideBar';
import { Box, styled } from '@mui/material';
import './style.scss';
import Breadcrumb from '../BreadCrumbs';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { getDevice } from '../../utils/utils';
import Footer from '../Footer';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Layout = ({ children }) => {
  const { isMobile } = getDevice();
  const { pathname } = useLocation();
  const isLoginUrl = pathname == '/login';
  const [ open, setOpen ] = useState<boolean>(true);

  useEffect(() => {
    pathname == '/' ? setOpen(false) : setOpen(true) ;
  }, [pathname]);

  const handleOpenMenu = () => {
    setOpen(!open);
  }
  const drawerWidth = 270;
  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

  const AppMenuBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const handleDrawerClose = () => {
    setOpen(!open);
  }
  
  return (
    <>
      {!isLoginUrl && 
          <>
          <AppMenuBar position="fixed" open={open}>
            <AppBar handleOpenMenu={handleOpenMenu} />
          </AppMenuBar>
         <Box sx={{ display: 'flex' }}>
            <MenuBar open={open} handleDrawerClose={handleDrawerClose} />
          <Main className={`${isMobile ? 'appBar' : 'appBar'}`} open={open}>
            { pathname != "/" && <Breadcrumb /> }
            {children}
            <Box className="footerContainer d-flex-center">
              <Footer txt={'v2024.03.1'} />
            </Box>
          </Main>
          </Box>
          </>
        }
        {isLoginUrl && children}
    </>
  );
}
 
export default Layout;