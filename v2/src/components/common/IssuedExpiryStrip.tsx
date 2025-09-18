"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  issued?: number | string;
  expiry?: number | string;
  sx?: SxProps<Theme>;
};

function normalizeDate(value?: number | string): Date | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value; // seconds -> ms
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

const IssuedExpiryStrip: React.FC<Props> = ({ issued, expiry, sx }) => {
  const t = useTranslations();
  const issuedDate = normalizeDate(issued);
  const expiryDate = normalizeDate(expiry);

  if (!issuedDate && !expiryDate) return null;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '0 0 8px 8px', px: 2, textAlign: 'center', ...sx }}>
      {issuedDate && (
        <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
          {t('verification.confirm.issuedOn')}: {issuedDate.toLocaleString()}
        </Typography>
      )}
      {expiryDate && (
        <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
          {t('verification.confirm.validUntil')}: {expiryDate.toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default IssuedExpiryStrip;
