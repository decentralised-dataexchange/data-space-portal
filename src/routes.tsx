import React from 'react';
import Login from './container/Login';
import { Route, Routes } from 'react-router-dom';
import GettingStarted from './container/GettingStarted';
import Home from './container/Home';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/start" element={<GettingStarted />} />
    </Routes>
  );
};

export default AppRouter;