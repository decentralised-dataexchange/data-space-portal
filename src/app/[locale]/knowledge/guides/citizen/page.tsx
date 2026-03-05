"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import ContentSection from '@/components/KnowledgeHub/ContentSection';

export default function CitizenGuidePage() {
  const t = useTranslations();

  return (
    <KnowledgeHubLayout>
      {/* Page Header */}
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
          {t('knowledgeHub.guides.citizen.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.guides.citizen.subtitle')}
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.guides.citizen.introTitle')}
        content={t('knowledgeHub.guides.citizen.introContent')}
      />

      <ContentSection
        title={t('knowledgeHub.guides.citizen.gettingStartedTitle')}
        content={t('knowledgeHub.guides.citizen.gettingStartedContent')}
      />

      <ContentSection
        title={t('knowledgeHub.guides.citizen.privacyDashboardTitle')}
        content={t('knowledgeHub.guides.citizen.privacyDashboardContent')}
      />

      {/* Privacy Dashboard Screenshot */}
      <Box
        sx={{
          my: 4,
          textAlign: 'center',
          p: 3,
          borderRadius: '20px',
          backgroundColor: '#fbfbfd',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <img
          src="/images/knowledge/fig-privacy-dashboard.png"
          alt="Privacy Dashboard in MyHealthEnabler showing data agreements with Allow/Disallow toggles"
          style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Privacy Dashboard in MyHealthEnabler: view and control all data agreements
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.guides.citizen.consentTitle')}
        content={t('knowledgeHub.guides.citizen.consentContent')}
      />

      {/* Consent Module Screenshot */}
      <Box
        sx={{
          my: 4,
          textAlign: 'center',
          p: 3,
          borderRadius: '20px',
          backgroundColor: '#fbfbfd',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <img
          src="/images/knowledge/fig-consent-data-agreement.png"
          alt="Consent Module in MyHealthEnabler showing data agreement details and authorisation"
          style={{ width: '100%', maxWidth: 720, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Consent Module: review data agreement details before authorising data sharing
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.guides.citizen.walletTitle')}
        content={t('knowledgeHub.guides.citizen.walletContent')}
      />

      <ContentSection
        title={t('knowledgeHub.guides.citizen.dataFlowTitle')}
        content={t('knowledgeHub.guides.citizen.dataFlowContent')}
      />

      <ContentSection
        title={t('knowledgeHub.guides.citizen.dpoTitle')}
        content={t('knowledgeHub.guides.citizen.dpoContent')}
      />
    </KnowledgeHubLayout>
  );
}
