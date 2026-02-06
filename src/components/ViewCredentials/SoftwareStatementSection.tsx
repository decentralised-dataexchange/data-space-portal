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
  isDetailView?: boolean;
}

const SoftwareStatementSection: React.FC<Props> = ({ ss, showValues = true, isDetailView = false }) => {
  const t = useTranslations();

  const hasSS = !!ss && Object.keys(ss || {}).length > 0;
  const { title, rows, issued, expiry } = useMemo(() => {
    if (!hasSS) return { title: undefined as string | undefined, rows: [] as AttributeRow[], issued: undefined as number | undefined, expiry: undefined as number | undefined };
    const vct: string | undefined = (ss as any)?.credential?.vct;
    const claims = (ss as any)?.credential?.claims ?? {};
    const clientUri: string | undefined = claims?.client_uri as string | undefined;
    const coverUrl: string | undefined = claims?.cover_url as string | undefined;
    const industrySector: string | undefined = claims?.industry_sector as string | undefined;
    const location: string | undefined = claims?.location as string | undefined;
    const logoUrl: string | undefined = claims?.logo_url as string | undefined;
    const name: string | undefined = claims?.name as string | undefined;
    const computedTitle = vct
      ? vct.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim()
      : t('developerAPIs.softwareStatementTitle');
    const rows: AttributeRow[] = [
      // Keep existing translated label for client_uri
      { label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: false },
      // Additional claims in required order with localized labels
      { label: t('developerAPIs.softwareStatementCoverUrlLabel'), value: coverUrl || '', href: coverUrl || undefined, copy: false },
      { label: t('developerAPIs.softwareStatementIndustrySectorLabel'), value: industrySector || '', copy: false },
      { label: t('developerAPIs.softwareStatementLocationLabel'), value: location || '', copy: false },
      { label: t('developerAPIs.softwareStatementLogoUrlLabel'), value: logoUrl || '', href: logoUrl || undefined, copy: false },
      { label: t('developerAPIs.softwareStatementNameLabel'), value: name || '', copy: false },
    ];
    const issued = (ss as any)?.createdAt as number | undefined;
    const expiry = (ss as any)?.updatedAt as number | undefined;
    return { title: computedTitle, rows, issued, expiry };
  }, [hasSS, ss, t]);

  if (!hasSS || rows.length === 0) return null;

  return (
    <Box sx={{ mt: isDetailView ? 0 : 3 }}>
      <Typography color="grey" mt={isDetailView ? 0 : 2} variant="subtitle1">
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
