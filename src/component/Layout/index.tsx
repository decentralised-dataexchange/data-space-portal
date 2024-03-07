
import React, { useState } from 'react';
import AppBar  from '../AppBar';
import { useLocation } from 'react-router-dom';
import MenuBar from '../MenuBar';
import { Box, styled } from '@mui/material';
import './style.scss';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isLoginUrl = pathname == '/login';
  const [ open, setOpen ] = useState<boolean>(false);
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
  
  return (
    <>
      {!isLoginUrl && 
         <AppBar handleOpenMenu={handleOpenMenu} />
        }
        <Box sx={{ display: 'flex' }}>
        {!isLoginUrl && <MenuBar open={open}/>}
          <Main className='appBar' open={open}>
          {children}
        </Main>
        </Box>
    </>
  );
}
 
export default Layout;