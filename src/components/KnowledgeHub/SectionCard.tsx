"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function SectionCard({ title, description, href, icon }: SectionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          height: '100%',
          p: 3,
          borderRadius: '20px',
          backgroundColor: '#fff',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            '& .arrow-icon': {
              transform: 'translateX(4px)',
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            mb: 2.5,
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1d1d1f',
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: '17px',
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.02em',
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            flex: 1,
          }}
        >
          {description}
        </Typography>
        <Box
          className="arrow-icon"
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#0071e3',
            fontSize: '14px',
            fontWeight: 500,
            opacity: 0.7,
            transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          Learn more <ArrowRight size={16} weight="bold" />
        </Box>
      </Box>
    </Link>
  );
}
