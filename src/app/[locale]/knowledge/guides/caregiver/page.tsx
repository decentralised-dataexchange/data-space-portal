"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';

function GuideImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      sx={{
        my: 3,
        textAlign: 'center',
        p: 2,
        borderRadius: '16px',
        backgroundColor: '#fbfbfd',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '8px' }}
      />
      <Typography
        sx={{ color: '#86868b', mt: 1.5, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
      >
        {alt}
      </Typography>
    </Box>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Box
      id={id}
      sx={{
        mb: 3,
        p: { xs: 2.5, md: 3.5 },
        borderRadius: '20px',
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1d1d1f',
          letterSpacing: '-0.02em',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="div"
      sx={{
        fontSize: '15px',
        color: '#424245',
        lineHeight: 1.7,
        letterSpacing: '-0.01em',
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '16px',
        fontWeight: 600,
        color: '#1d1d1f',
        letterSpacing: '-0.01em',
        mt: 3,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 3, mb: 1.5 }}>
      {items.map((item, idx) => (
        <Typography
          key={idx}
          component="li"
          sx={{
            fontSize: '15px',
            color: '#424245',
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
            mb: 0.5,
          }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
}

const img = (name: string) => `/images/knowledge/mhe/${name}`;

export default function CaregiverGuidePage() {
  const t = useTranslations();

  const tocItems = [
    { id: 'create-account', label: '1. Create an Account' },
    { id: 'overview-patients', label: '2. Overview of Patients' },
    { id: 'patient-data-view', label: '3. Patient Data View' },
  ];

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
          {t('knowledgeHub.guides.caregiver.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.guides.caregiver.subtitle')}
        </Typography>
      </Box>

      {/* Table of Contents */}
      <Box
        sx={{
          mb: 4,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '20px',
          backgroundColor: '#fff',
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Typography
          sx={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.02em', mb: 2 }}
        >
          Table of Contents
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {tocItems.map((item) => (
            <Typography
              key={item.id}
              component="a"
              href={`#${item.id}`}
              sx={{
                fontSize: '14px',
                color: '#0071e3',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Section 1: Create Account */}
      <Section id="create-account" title="1. Create an Account">
        <Para>
          As a caregiver, you have access to the CRANE Caregiver web portal where you can view health data shared by your patients. To get started, create a caregiver account through your healthcare organisation. Once your account is set up, you can log in to the Caregiver web portal.
        </Para>
        <Para>
          Only patients who have chosen to share their health data with your region will be visible in your patient list. Patient data sharing is always initiated and controlled by the patient through their MyHealthEnabler app.
        </Para>
      </Section>

      {/* Section 2: Overview of Patients */}
      <Section id="overview-patients" title="2. Overview of Patients">
        <Para>
          After logging in, the Caregiver web portal displays an overview of all patients who have shared their health data with you. The My Patients view shows:
        </Para>
        <BulletList items={[
          'Patient name',
          'Personal identity number',
          'Date of latest measurements',
          'Total number of measurements',
        ]} />
        <Para>
          You can search for a specific patient using the search bar at the top. Click on any patient row to view their detailed health data.
        </Para>
        <GuideImage
          src={img('caregiver-p2-1.png')}
          alt="Caregiver web portal - My Patients overview showing patient list with names, identity numbers, and measurement counts"
        />
      </Section>

      {/* Section 3: Patient Data View */}
      <Section id="patient-data-view" title="3. Patient Data View">
        <Para>
          When you click on a patient, you see their complete health data overview. The patient profile header shows their name, age, weight, height, and contact details (email, phone, address).
        </Para>
        <Para>
          Below the header, the dashboard displays cards for each type of health data being collected:
        </Para>
        <BulletList items={[
          'Questionnaires - survey responses',
          'Blood pressure - systolic and diastolic readings over time',
          'Weight - weight measurements with trend graph',
          'Hemoglobin - hemoglobin levels (g/l)',
          'Glucose - blood sugar levels (mmol/l)',
          'CRP - C-reactive protein levels (mg/L)',
          'Temperature - body temperature readings',
        ]} />
        <Para>
          Each card shows a small trend chart and the latest value. Click on any card to view the full measurement history.
        </Para>
        <GuideImage
          src={img('caregiver-p3-1.png')}
          alt="Patient data overview showing health metric cards for questionnaires, blood pressure, weight, hemoglobin, glucose, CRP, and temperature"
        />

        <SubHeading>Measurement History</SubHeading>
        <Para>
          When you open a specific measurement category, you can see the full history with an interactive chart showing values over time. Below the chart, the Measurements History tab lists each individual reading with its date and value. You can also switch to the Survey Responses tab to view questionnaire answers.
        </Para>

        <SubHeading>Glucose Measurements</SubHeading>
        <Para>
          The glucose measurement view shows blood sugar levels over time, with each data point plotted on an interactive graph. Measurement limits are displayed alongside actual values to help identify readings outside the normal range.
        </Para>
        <GuideImage
          src={img('caregiver-p4-1.png')}
          alt="Glucose measurement history - chart showing blood sugar levels over time with measurement history list"
        />

        <SubHeading>Oxygen Saturation &amp; Pulse</SubHeading>
        <Para>
          The oxygen saturation view displays SpO2 and pulse readings over time. The chart plots both oxygen saturation percentage and pulse rate (bpm), with data points you can hover over for exact values and dates.
        </Para>
        <GuideImage
          src={img('caregiver-p5-1.png')}
          alt="Oxygen saturation and pulse measurement history - chart showing SpO2 and pulse values over time"
        />

        <SubHeading>Weight Measurements</SubHeading>
        <Para>
          The weight view shows body weight measurements over time, making it easy to track weight trends. Each measurement is listed with its date and value in kilograms.
        </Para>
        <GuideImage
          src={img('caregiver-p6-1.png')}
          alt="Weight measurement history - chart showing weight values over time with dated entries"
        />
      </Section>
    </KnowledgeHubLayout>
  );
}
