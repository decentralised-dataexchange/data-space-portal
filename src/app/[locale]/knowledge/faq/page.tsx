"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import FaqItem from '@/components/KnowledgeHub/FaqItem';
import { EnvelopeSimple } from '@phosphor-icons/react';

export default function FaqPage() {
  const t = useTranslations();

  const faqSections = [
    {
      heading: t('knowledgeHub.faq.accountOnboarding'),
      items: [
        { q: t('knowledgeHub.faq.q_cantCreateAccount'), a: t('knowledgeHub.faq.a_cantCreateAccount') },
        { q: t('knowledgeHub.faq.q_continueOnboarding'), a: t('knowledgeHub.faq.a_continueOnboarding') },
      ],
    },
    {
      heading: t('knowledgeHub.faq.walletIssues'),
      items: [
        { q: t('knowledgeHub.faq.q_walletNotFound'), a: t('knowledgeHub.faq.a_walletNotFound') },
        { q: t('knowledgeHub.faq.q_walletConnectionFails'), a: t('knowledgeHub.faq.a_walletConnectionFails') },
      ],
    },
    {
      heading: t('knowledgeHub.faq.verification'),
      items: [
        { q: t('knowledgeHub.faq.q_verificationFails'), a: t('knowledgeHub.faq.a_verificationFails') },
        { q: t('knowledgeHub.faq.q_softwareStatement'), a: t('knowledgeHub.faq.a_softwareStatement') },
      ],
    },
    {
      heading: t('knowledgeHub.faq.oauth'),
      items: [
        { q: t('knowledgeHub.faq.q_oauthConfusion'), a: t('knowledgeHub.faq.a_oauthConfusion') },
      ],
    },
    {
      heading: t('knowledgeHub.faq.ddas'),
      items: [
        { q: t('knowledgeHub.faq.q_ddaUnlisted'), a: t('knowledgeHub.faq.a_ddaUnlisted') },
        { q: t('knowledgeHub.faq.q_ddaNotVisible'), a: t('knowledgeHub.faq.a_ddaNotVisible') },
      ],
    },
    {
      heading: t('knowledgeHub.faq.apiAccess'),
      items: [
        { q: t('knowledgeHub.faq.q_tokenErrors'), a: t('knowledgeHub.faq.a_tokenErrors') },
      ],
    },
  ];

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
          {t('knowledgeHub.faq.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.faq.subtitle')}
        </Typography>
      </Box>

      {faqSections.map((section) => (
        <Box key={section.heading} sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 600,
              color: '#1d1d1f',
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            {section.heading}
          </Typography>
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            {section.items.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </Box>
        </Box>
      ))}

      {/* Contact Support */}
      <Box
        sx={{
          mt: 5,
          p: { xs: 3, md: 4 },
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d30 100%)',
          color: 'white',
          display: 'flex',
          gap: 2.5,
          alignItems: 'flex-start',
        }}
      >
        <EnvelopeSimple size={24} color="rgba(255,255,255,0.7)" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <Box>
          <Typography
            sx={{
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {t('knowledgeHub.faq.contactSupport')}
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
            }}
          >
            {t('knowledgeHub.faq.contactSupportContent')}
          </Typography>
        </Box>
      </Box>
    </KnowledgeHubLayout>
  );
}
