import React, { useEffect } from 'react';
import Login from './container/Login';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import GettingStarted from './container/GettingStarted';
import Home from './container/Home';
import DDAgreements from './container/DDAgreements';
import ManageAdmin from './container/Account/ManageAdmin/manageAdmin';
import DeveloperApis from './container/Account/DeveloperApis/developerApis';
import DispConnections from './container/Account/DISPconnections/dispConnection';
import { useTranslation } from 'react-i18next';
import DataSourceListing from './container/Home/DataSourceListing';

const AppRouter = () => {
  const { t } = useTranslation("translation");
  const isAuthenticated = localStorage.getItem('Token');
  return (
    <Routes>
      {isAuthenticated &&
        <>
          <Route path={`/${t("route.start")}`} element={<GettingStarted />} />
          <Route path={`/${t("route.dd-agreements")}`} element={<DDAgreements />} />
          <Route path={`/${t("route.manageAdmin")}`} element={<ManageAdmin />} />
          <Route path={`/${t("route.developerApis")}`} element={<DeveloperApis />} />
          <Route path={`/${t("route.dispConnections")}`} element={<DispConnections />} />
        </>
      }
        <>
            <Route path="/" element={<Home />} />
            <Route path="/data-source/read" element={<DataSourceListing />} />
            <Route path={`/${t("route.login")}`} element={<Login />} />
            {/* Legacy ApiDoc route removed; v2 Next.js renders API docs via v2/src/components/ApiDocs */}
          </>
    </Routes>
  );
};

export default AppRouter;