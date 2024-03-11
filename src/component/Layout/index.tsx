
import React, { useEffect, useState } from 'react';
import AppBar  from '../AppBar';
import { useLocation } from 'react-router-dom';
import MenuBar from '../MenuBar';
import { Box, styled } from '@mui/material';
import './style.scss';
import Breadcrumb from '../BreadCrumbs';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isLoginUrl = pathname == '/login';
  const [ open, setOpen ] = useState<boolean>(false);

  useEffect(() => {
    pathname == '/' && setOpen(false);
  }, [pathname]);

  const handleOpenMenu = () => {
    setOpen(!open)
  }
  const drawerWidth = 240;
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
  
  return (
    <>
      {!isLoginUrl && 
          <>
          <AppMenuBar position="fixed" open={open}>
            <AppBar handleOpenMenu={handleOpenMenu} />
          </AppMenuBar>
         <Box sx={{ display: 'flex' }}>
            <MenuBar open={open}/>
          <Main className='appBar' open={open}>
            { pathname != "/" && <Breadcrumb /> }
            {children}
          </Main>
          </Box>
          </>
        }
        {isLoginUrl && children}
    </>
  );
}
 
export default Layout;