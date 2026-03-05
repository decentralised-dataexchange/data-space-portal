"use client";

import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import ContentSection from '@/components/KnowledgeHub/ContentSection';

export default function ToolsPage() {
  const t = useTranslations();

  return (
    <KnowledgeHubLayout>
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            fontSize: { xs: '28px', md: '40px' },
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            mb: 1.5,
          }}
        >
          {t('knowledgeHub.tools.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.tools.subtitle')}
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.tools.consentSDK')}
        content={t('knowledgeHub.tools.consentSDKContent')}
        link={{ label: 'View Documentation', href: t('knowledgeHub.tools.consentSDKLink') }}
      />

      <ContentSection
        title={t('knowledgeHub.tools.walletSDK')}
        content={t('knowledgeHub.tools.walletSDKContent')}
        link={{ label: 'View Documentation', href: t('knowledgeHub.tools.walletSDKLink') }}
      />

      <ContentSection
        title={t('knowledgeHub.tools.restAPI')}
        content={t('knowledgeHub.tools.restAPIContent')}
        link={{ label: 'View API Reference', href: t('knowledgeHub.tools.restAPILink') }}
      />

      <ContentSection
        title={t('knowledgeHub.tools.tokenValidation')}
        content={t('knowledgeHub.tools.tokenValidationContent')}
      />

      <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)' }} />

      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#1d1d1f',
          letterSpacing: '-0.03em',
          mb: 3,
        }}
      >
        {t('knowledgeHub.tools.referenceImplementations')}
      </Typography>

      <ContentSection
        title={t('knowledgeHub.tools.resourceServer')}
        content={t('knowledgeHub.tools.resourceServerContent')}
        link={{ label: 'View on GitHub', href: t('knowledgeHub.tools.resourceServerLink') }}
      />

      <ContentSection
        title={t('knowledgeHub.tools.mobileApp')}
        content={t('knowledgeHub.tools.mobileAppContent')}
        link={{ label: 'View on GitHub', href: t('knowledgeHub.tools.mobileAppLink') }}
      />

      <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)' }} />

      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#1d1d1f',
          letterSpacing: '-0.03em',
          mb: 3,
        }}
      >
        {t('knowledgeHub.tools.roles')}
      </Typography>

      <ContentSection
        title={t('knowledgeHub.tools.marketplaceAdmin')}
        content={t('knowledgeHub.tools.marketplaceAdminContent')}
      />

      <ContentSection
        title={t('knowledgeHub.tools.orgAdmin')}
        content={t('knowledgeHub.tools.orgAdminContent')}
      />
    </KnowledgeHubLayout>
  );
}
