"use client";

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { OrgIdentityResponse } from '@/types/orgIdentity';
import { Organisation } from '@/types/organisation';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { AttributeTable, AttributeRow } from '@/components/common/AttributeTable';
import IssuedExpiryStrip from '@/components/common/IssuedExpiryStrip';

type Props = {
  orgIdentity?: OrgIdentityResponse;
  organisation?: Organisation;
  showValues?: boolean;
  isDetailView?: boolean;
  customVctTitle?: string;
};

const ViewCredentials: React.FC<Props> = ({ orgIdentity, organisation, showValues = true, isDetailView = false, customVctTitle }) => {
  const t = useTranslations();

  const presentation = useMemo(() => {
    const p = orgIdentity?.organisationalIdentity?.presentation as any[] | undefined;
    return Array.isArray(p) && p.length > 0 ? p[0] as any : undefined;
  }, [orgIdentity]);

  const legalName = presentation?.legalName as string | undefined;
  const identifier = presentation?.identifier as string | undefined;
  const isVerified = Boolean(orgIdentity?.verified ?? orgIdentity?.organisationalIdentity?.verified);
  const issuedAt = (presentation as any)?.iat as number | undefined;
  const expiresAt = (presentation as any)?.exp as number | undefined;
  // Access Point Endpoint intentionally not shown under avatar/trust label

  const vctTitle = useMemo(() => {
    if (customVctTitle) return customVctTitle;
    const vct = presentation?.vct as string | undefined;
    if (!vct) return t('common.certificateOfRegistration');
    // Insert spaces between camelCase/PascalCase boundaries and acronyms
    return vct
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim();
  }, [presentation, t, customVctTitle]);

  return (
    <Box sx={{ paddingTop: isDetailView ? '0px' : '30px' }}>
      {!isDetailView && (
        <>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
              {organisation?.name || t('gettingStarted.viewCredential')}
              <VerifiedBadge trusted={isVerified} />
            </Typography>
          </Box>
          {/* Access Point Endpoint removed from below avatar section */}
          <Typography variant="subtitle1" mt={2}>
            {t('common.overView')}
          </Typography>
          <Typography
            variant="subtitle2"
            color="black"
            mt={0.5}
            sx={{ wordWrap: 'break-word' }}
          >
            {organisation?.description || ''}
          </Typography>
        </>
      )}

      <Typography color="grey" mt={isDetailView ? 0 : 2} variant="subtitle1">
        {vctTitle}
      </Typography>

      <Box sx={{ marginTop: '16px' }}>
        <AttributeTable
          rows={[
            ...(legalName ? [{ label: t('viewCredentials.legalNameLabel'), value: legalName } as AttributeRow] : []),
            ...(identifier ? [{ label: t('viewCredentials.identifierLabel'), value: identifier } as AttributeRow] : []),
          ]}
          showValues={showValues}
          labelMinWidth={200}
          labelMaxPercent={40}
        />
        <IssuedExpiryStrip issued={issuedAt} expiry={expiresAt} />
      </Box>

      {/* Close button removed; RightSidebar footer provides the Close action */}
    </Box>
  );
};

export default ViewCredentials;
