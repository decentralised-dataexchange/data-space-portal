"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import ContentSection from '@/components/KnowledgeHub/ContentSection';

interface CitizenGuideContentProps {
  appName: string;
  /** When true, includes the app introduction and getting started sections.
   *  Set to false when embedding inside an app-specific guide that already covers these. */
  showIntro?: boolean;
}

export default function CitizenGuideContent({ appName, showIntro = true }: CitizenGuideContentProps) {
  const t = useTranslations();

  const r = (text: string) => text.replace(/MyHealthEnabler/g, appName);

  return (
    <>
      {showIntro && (
        <>
          <ContentSection
            title={r(t('knowledgeHub.guides.citizen.introTitle'))}
            content={r(t('knowledgeHub.guides.citizen.introContent'))}
          />

          <ContentSection
            title={r(t('knowledgeHub.guides.citizen.gettingStartedTitle'))}
            content={r(t('knowledgeHub.guides.citizen.gettingStartedContent'))}
          />
        </>
      )}

      <ContentSection
        title={r(t('knowledgeHub.guides.citizen.privacyDashboardTitle'))}
        content={r(t('knowledgeHub.guides.citizen.privacyDashboardContent'))}
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
          alt={`Privacy Dashboard in ${appName} showing data agreements with Allow/Disallow toggles`}
          style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          {`Privacy Dashboard in ${appName}: view and control all data agreements`}
        </Typography>
      </Box>

      <ContentSection
        title={r(t('knowledgeHub.guides.citizen.consentTitle'))}
        content={r(t('knowledgeHub.guides.citizen.consentContent'))}
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
          alt={`Consent Module in ${appName} showing data agreement details and authorisation`}
          style={{ width: '100%', maxWidth: 720, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Consent Module: review data agreement details before authorising data sharing
        </Typography>
      </Box>

      <ContentSection
        title={r(t('knowledgeHub.guides.citizen.walletTitle'))}
        content={r(t('knowledgeHub.guides.citizen.walletContent'))}
      />

      <ContentSection
        title={r(t('knowledgeHub.guides.citizen.dataFlowTitle'))}
        content={r(t('knowledgeHub.guides.citizen.dataFlowContent'))}
      />

      <ContentSection
        title={r(t('knowledgeHub.guides.citizen.dpoTitle'))}
        content={r(t('knowledgeHub.guides.citizen.dpoContent'))}
      />
    </>
  );
}
