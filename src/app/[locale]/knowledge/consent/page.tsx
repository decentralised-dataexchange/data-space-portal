"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import ContentSection, { renderInline } from '@/components/KnowledgeHub/ContentSection';

export default function ConsentPage() {
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
          {t('knowledgeHub.consent.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.consent.subtitle')}
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.consent.whatIsMarketplace')}
        content={t('knowledgeHub.consent.whatIsMarketplaceContent')}
        link={{ label: 'Learn more about the CRANE project', href: 'https://crane-pcp.eu/concept' }}
      />

      <ContentSection
        title={t('knowledgeHub.consent.whatIsDA')}
        content={t('knowledgeHub.consent.whatIsDAContent')}
        link={{ label: 'Read more about Data Agreements', href: 'https://docs.igrant.io/concepts/data-agreements/' }}
      />

      <ContentSection
        title={t('knowledgeHub.consent.whatIsDDA')}
        content={t('knowledgeHub.consent.whatIsDDAContent')}
        link={{ label: 'Read more about Data Disclosure Agreements', href: 'https://docs.igrant.io/concepts/data-disclosure-agreements/' }}
      />

      {/* DEXA Framework Explanation + Diagram */}
      <ContentSection
        title={t('knowledgeHub.consent.dexaFrameworkTitle')}
        content={t('knowledgeHub.consent.dexaFrameworkContent')}
      />

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
          src="/images/knowledge/fig1-data-exchange-framework.png"
          alt="Data Exchange Agreements (DEXA) Landscape adopted in CRANE"
          style={{ width: '100%', maxWidth: 720, height: 'auto', display: 'block', margin: '0 auto' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Data Exchange Agreements (DEXA) Landscape adopted in CRANE
        </Typography>
      </Box>

      <ContentSection
        title={t('knowledgeHub.consent.trustAndVerification')}
        content={t('knowledgeHub.consent.trustAndVerificationContent')}
      />

      {/* Citizen Rights Section */}
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography
          sx={{
            fontSize: { xs: '22px', md: '28px' },
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {t('knowledgeHub.consent.citizenRights')}
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            color: '#1d1d1f',
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
            mb: 3,
          }}
        >
          {renderInline(t('knowledgeHub.consent.citizenRightsIntro'))}
        </Typography>
      </Box>

      {/* Privacy Dashboard */}
      <ContentSection
        title={t('knowledgeHub.consent.privacyDashboardTitle')}
        content={t('knowledgeHub.consent.privacyDashboardContent')}
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
          alt="Privacy Dashboard showing data agreements with Allow/Disallow toggles"
          style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Privacy Dashboard: Citizens can view and control all data agreements with Allow/Disallow toggles
        </Typography>
      </Box>

      {/* Consent Module */}
      <ContentSection
        title={t('knowledgeHub.consent.consentModuleTitle')}
        content={t('knowledgeHub.consent.consentModuleContent')}
      />

      {/* Data Agreement Details Screenshot */}
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
          alt="Data Agreement details screen showing attributes and consent options"
          style={{ width: '100%', maxWidth: 720, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }}
        />
        <Typography
          sx={{ color: '#86868b', mt: 2, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
        >
          Data Agreement details: Citizens can review all data attributes before giving or withdrawing consent
        </Typography>
      </Box>

      {/* GDPR Rights */}
      <ContentSection
        title={t('knowledgeHub.consent.gdprRightsTitle')}
        content={t('knowledgeHub.consent.gdprRightsContent')}
      />

      {/* CRANE Project Reference */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '16px',
          backgroundColor: '#f5f5f7',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Typography
          sx={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', mb: 1.5 }}
        >
          About the CRANE Project
        </Typography>
        <Typography
          sx={{ fontSize: '14px', color: '#1d1d1f', lineHeight: 1.7, letterSpacing: '-0.01em', mb: 1.5 }}
        >
          CRANE is an H2020 Pre-Commercial Procurement European project addressing the comprehensive treatment of chronic diseases in rural areas: Region V&#228;sterbotten in Sweden, Extremadura in Spain, and Agder in Norway. It aims to empower citizens to become active managers of their own health through secure, transparent data sharing built on the European Health Data Space concept.
        </Typography>
        <a
          href="https://crane-pcp.eu/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0071e3',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Visit the CRANE project website →
        </a>
      </Box>

      {/* GDPR Reference Links */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '16px',
          backgroundColor: '#f5f5f7',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Typography
          sx={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', mb: 1.5 }}
        >
          GDPR Reference
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { label: 'Article 5 -Principles relating to processing of personal data', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-5-principles-relating-to-processing-of-personal-data' },
            { label: 'Article 6 -Lawfulness of processing', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-6-lawfulness-of-processing' },
            { label: 'Article 7 -Conditions for consent', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-7-conditions-for-consent' },
            { label: 'Article 15 -Right of access by the data subject', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-15-right-of-access-by-the-data-subject' },
            { label: 'Article 16 -Right to rectification', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-16-right-to-rectification' },
            { label: 'Article 17 -Right to erasure', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-17-right-to-erasure-right-to-be-forgotten' },
            { label: 'Article 18 -Right to restriction of processing', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-18-right-to-restriction-of-processing' },
            { label: 'Article 20 -Right to data portability', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-20-right-to-data-portability' },
            { label: 'Article 21 -Right to object', href: 'https://docs.igrant.io/regulations/reg-eu-gdpr/#article-21-right-to-object' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0071e3',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {item.label} →
            </a>
          ))}
        </Box>
      </Box>
    </KnowledgeHubLayout>
  );
}
