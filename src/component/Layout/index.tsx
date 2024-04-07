
import React, { useEffect, useState } from 'react';
import AppBar  from '../AppBar';
import { useLocation } from 'react-router-dom';
import MenuBar from '../SideBar';
import { Box, styled } from '@mui/material';
import './style.scss';
import Breadcrumb from '../BreadCrumbs';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { getDevice, publicRoutes } from '../../utils/utils';
import Footer from '../Footer';
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { adminAction } from "../../redux/actionCreators/login";
import { dataSourceAction  } from "../../redux/actionCreators/dataSource";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Layout = ({ children }) => {
  const { isMobile, isTablet } = getDevice();
  const { pathname } = useLocation();
  const isLoginUrl = pathname == '/login';
  const [ open, setOpen ] = useState<boolean>(true);
  const isDeskTop = (!isMobile && !isTablet);
  const dispatch = useAppDispatch();
  const isAuthenticated = localStorage.getItem('Token');

  useEffect(() => {
    publicRoutes(pathname) ? setOpen(false) : setOpen(isDeskTop ? true : false) ;
  }, [pathname]);

  const adminData = useAppSelector(
    (state) => state?.user?.data
  );

  const dataSource = useAppSelector(
    (state) => state?.dataSourceList?.data
  );

  useEffect(() => {
    !adminData?.name && dispatch(adminAction());
    !dataSource && dispatch(dataSourceAction());
  }, [])

  const handleOpenMenu = () => {
    if(!publicRoutes(pathname) || isAuthenticated) {
      setOpen(!open);
    }
  }
  const drawerWidth = 260;
  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: pathname == '/data-source/open-api' ? '80px' : '100px',
    marginLeft: `-${drawerWidth}px`,
    width: '100%',
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      width: 'calc(100% - 260px)'
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
  // const isNotLoginPage = (( && isAuthenticated) || publicRoutes());
  
  return (
    <>
      {!isLoginUrl ? 
          <>
          <AppMenuBar position="fixed" open={open}>
            <AppBar handleOpenMenu={handleOpenMenu} />
          </AppMenuBar>
         <Box className="leftNavigationContainer">
          {
            isAuthenticated && <MenuBar open={open} handleDrawerClose={handleDrawerClose} />
          }
            
          <Main className='appBar' open={open}>
            { !publicRoutes(pathname) && <Breadcrumb /> }
            {children}
          </Main>
          <Box className="footerContainer d-flex-center">
              <Footer txt={'v2024.03.1'} />
            </Box>
          </Box>
          </>
          : <>{children}</>
        }
    </>
  );
}
 
export default Layout;