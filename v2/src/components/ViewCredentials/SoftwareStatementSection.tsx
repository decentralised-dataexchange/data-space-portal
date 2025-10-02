"use client";

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AttributeTable, AttributeRow } from '@/components/common/AttributeTable';
import IssuedExpiryStrip from '@/components/common/IssuedExpiryStrip';

export type SoftwareStatementLike = Record<string, any> | undefined;

interface Props {
  ss?: SoftwareStatementLike;
  showValues?: boolean;
}

const SoftwareStatementSection: React.FC<Props> = ({ ss, showValues = true }) => {
  const t = useTranslations();

  const hasSS = !!ss && Object.keys(ss || {}).length > 0;
  const { title, rows, issued, expiry } = useMemo(() => {
    if (!hasSS) return { title: undefined as string | undefined, rows: [] as AttributeRow[], issued: undefined as number | undefined, expiry: undefined as number | undefined };
    const vct: string | undefined = (ss as any)?.credential?.vct;
    const clientUri: string | undefined = (ss as any)?.credential?.claims?.client_uri;
    const computedTitle = vct
      ? vct.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim()
      : t('developerAPIs.softwareStatementTitle');
    const rows: AttributeRow[] = [
      { label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: false },
    ];
    const issued = (ss as any)?.createdAt as number | undefined;
    const expiry = (ss as any)?.updatedAt as number | undefined;
    return { title: computedTitle, rows, issued, expiry };
  }, [hasSS, ss, t]);

  if (!hasSS || rows.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography color="grey" mt={2} variant="subtitle1">
        {title}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <AttributeTable rows={rows} showValues={showValues} labelMinWidth={200} labelMaxPercent={40} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <IssuedExpiryStrip issued={issued} expiry={expiry} />
      </Box>
    </Box>
  );
};

export default SoftwareStatementSection;
