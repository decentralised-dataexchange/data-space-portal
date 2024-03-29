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

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
});

const App = () => {
  const isAuthenticated = localStorage.getItem('Token');
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const renderPublicRoutes = (path: string) => {
    if(path === '/') {
      navigate('/');
      return;
    } else {
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
