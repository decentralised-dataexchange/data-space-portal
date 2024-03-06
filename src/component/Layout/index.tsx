
import React from 'react';
import AppBar  from '../AppBar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isLoginUrl = pathname == '/login';
  return (
    <>
      {!isLoginUrl && <AppBar />}
        <>{ children }</>
    </>
  );
}
 
export default Layout;