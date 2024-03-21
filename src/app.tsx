/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import AppRouter from './routes';
import './index.css';
import Layout from './component/Layout';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  typography: {
    fontSize: 14,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <AppRouter />
      </Layout>
    </ThemeProvider>
  )
};

export default App;
