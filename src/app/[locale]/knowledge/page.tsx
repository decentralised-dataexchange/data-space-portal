"use client";

import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import SectionCard from '@/components/KnowledgeHub/SectionCard';
import {
  Shield,
  BookOpen,
  Wrench,
  Question,
} from '@phosphor-icons/react';

export default function KnowledgeHubPage() {
  const t = useTranslations();

  const sections = [
    {
      title: t('knowledgeHub.consent.title'),
      description: t('knowledgeHub.consent.subtitle'),
      href: '/knowledge/consent',
      icon: <Shield size={24} weight="duotone" />,
    },
    {
      title: t('knowledgeHub.guides.title'),
      description: t('knowledgeHub.guides.subtitle'),
      href: '/knowledge/guides',
      icon: <BookOpen size={24} weight="duotone" />,
    },
    {
      title: t('knowledgeHub.tools.title'),
      description: t('knowledgeHub.tools.subtitle'),
      href: '/knowledge/tools',
      icon: <Wrench size={24} weight="duotone" />,
    },
    {
      title: t('knowledgeHub.faq.title'),
      description: t('knowledgeHub.faq.subtitle'),
      href: '/knowledge/faq',
      icon: <Question size={24} weight="duotone" />,
    },
  ];

  return (
    <KnowledgeHubLayout>
      {/* Hero */}
      <Box sx={{ mb: 6, textAlign: 'center', pt: { xs: 2, md: 4 }, pb: { xs: 2, md: 3 } }}>
        <Typography
          sx={{
            fontSize: { xs: '32px', md: '48px' },
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          {t('knowledgeHub.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '21px' },
            color: '#86868b',
            maxWidth: 640,
            mx: 'auto',
            lineHeight: 1.5,
            letterSpacing: '-0.02em',
            fontWeight: 400,
          }}
        >
          {t('knowledgeHub.subtitle')}
        </Typography>
      </Box>

      {/* Section Cards */}
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid key={section.href} size={{ xs: 12, sm: 6, md: 3 }}>
            <SectionCard {...section} />
          </Grid>
        ))}
      </Grid>
    </KnowledgeHubLayout>
  );
}
