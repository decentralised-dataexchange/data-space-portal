"use client";

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoaderProps {
  isBtnLoader?: boolean;
}

const Loader = ({ isBtnLoader = false }: LoaderProps) => {
  if (isBtnLoader) {
    return <CircularProgress size={20} />;
  }
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        width: '100%'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
