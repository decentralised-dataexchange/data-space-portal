"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { SxProps, Theme } from '@mui/material/styles';
import { normalizeDate, formatDateWithOrdinal } from '@/utils/dateFormat';

type Props = {
  issued?: number | string;
  expiry?: number | string;
  sx?: SxProps<Theme>;
};

const IssuedExpiryStrip: React.FC<Props> = ({ issued, expiry, sx }) => {
  const t = useTranslations();
  const issuedDate = normalizeDate(issued);
  const expiryDate = normalizeDate(expiry);

  if (!issuedDate && !expiryDate) return null;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '0 0 8px 8px', px: 2, textAlign: 'center', ...sx }}>
      {issuedDate && (
        <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
          {t('verification.confirm.issued')}: {formatDateWithOrdinal(issuedDate)}
        </Typography>
      )}
      {expiryDate && (
        <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
          {t('verification.confirm.expiry')}: {formatDateWithOrdinal(expiryDate)}
        </Typography>
      )}
    </Box>
  );
};

export default IssuedExpiryStrip;
