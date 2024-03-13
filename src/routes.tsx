import React from 'react';
import Login from './container/Login';
import { Route, Routes } from 'react-router-dom';
import GettingStarted from './container/GettingStarted';
import Home from './container/Home';
import DDAgreements from './container/DDAgreements';
import { useTranslation } from 'react-i18next';

const AppRouter = () => {
  const { t } = useTranslation("translation");
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path={`/${t("route.login")}`} element={<Login />} />
      <Route path={`/${t("route.start")}`} element={<GettingStarted />} />
      <Route path={`/${t("route.dd-agreements")}`} element={<DDAgreements />} />
    </Routes>
  );
};

export default AppRouter;