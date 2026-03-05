"use client";

import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import SectionCard from '@/components/KnowledgeHub/SectionCard';
import { Buildings, User } from '@phosphor-icons/react';

export default function GuidesPage() {
  const t = useTranslations();

  const guides = [
    {
      title: t('knowledgeHub.guides.provider.title'),
      description: t('knowledgeHub.guides.provider.subtitle'),
      href: '/knowledge/guides/provider',
      icon: <Buildings size={24} weight="duotone" />,
    },
    {
      title: t('knowledgeHub.guides.citizen.title'),
      description: t('knowledgeHub.guides.citizen.subtitle'),
      href: '/knowledge/guides/citizen',
      icon: <User size={24} weight="duotone" />,
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
          {t('knowledgeHub.guides.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.guides.subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {guides.map((guide) => (
          <Grid key={guide.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <SectionCard {...guide} />
          </Grid>
        ))}
      </Grid>
    </KnowledgeHubLayout>
  );
}
