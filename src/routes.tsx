import React from 'react';
import Login from './container/Login';
import { Route, Routes } from 'react-router-dom';
import GettingStarted from './container/GettingStarted';
import Home from './container/Home';
import DDAgreements from './container/DDAgreements';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/start" element={<GettingStarted />} />
      <Route path="/dd-agreements" element={<DDAgreements />} />
    </Routes>
  );
};

export default AppRouter;