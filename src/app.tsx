/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect } from 'react';
import AppRouter from './routes';
import './index.css';
import Layout from './component/Layout';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useNavigate, useLocation  } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { LocalStorageService } from './utils/localStorageService';

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
});

const App = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const isAuthenticated = localStorage.getItem('Token');
  const encodeToken = isAuthenticated && jwtDecode(isAuthenticated);
  const currentTime = new Date();
  const expiryTime = new Date(encodeToken?.exp * 1000);
  if(currentTime > expiryTime) {
    LocalStorageService.clear();
    navigate('/login')
  }


  const renderPublicRoutes = (path: string) => {
    if(path === '/') {
      navigate('/');
      return;
    } else if (path === '/data-source/read') {
      navigate('/data-source/read');
    } else if (path === '/data-source/open-api') {
      navigate('/data-source/open-api');
    } 
    else {
      navigate('/login');
      return;
    }
  }

  useEffect(() => {
    const publicRoute = location !== '/'
    !isAuthenticated && publicRoute && renderPublicRoutes(location);
  }, [location])

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <AppRouter />
      </Layout>
    </ThemeProvider>
  )
};

export default App;
