"use client";

import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface KnowledgeHubLayoutProps {
  children: ReactNode;
}

export default function KnowledgeHubLayout({ children }: KnowledgeHubLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 120px)',
        pt: { xs: 2, md: 3 },
        pb: 8,
        background: 'linear-gradient(180deg, #f8f8fa 0%, #ffffff 40%)',
      }}
    >
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
}
