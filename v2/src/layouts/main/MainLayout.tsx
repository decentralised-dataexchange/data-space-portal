"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import MainAppBar from '@/components/common/AppBar/MainAppBar';
import Footer from '@/components/common/Footer';
import SideBar from '@/components/common/SideBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import '../style.scss';
// import '@/components/common/Breadcrumb/style.scss';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpenMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <MainAppBar handleOpenMenu={handleOpenMenu} />
      <Box className="leftNavigationContainer" sx={{ marginLeft: open ? '260px' : 0, transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms' }}>
      <SideBar open={open} handleDrawerClose={handleOpenMenu} />
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
          <Breadcrumb />
          {children}
        </Box>
        <Box className="footerContainer d-flex-center">
          <Footer txt={'v2024.03.1'} />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
