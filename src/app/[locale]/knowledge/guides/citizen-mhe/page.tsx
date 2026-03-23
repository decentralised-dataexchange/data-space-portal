"use client";

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import KnowledgeHubLayout from '@/components/KnowledgeHub/KnowledgeHubLayout';
import CitizenGuideContent from '@/components/KnowledgeHub/CitizenGuideContent';

function GuideImage({ src, alt, maxWidth = '100%' }: { src: string; alt: string; maxWidth?: string | number }) {
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
        style={{ width: '100%', maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth, height: 'auto', display: 'block', margin: '0 auto', borderRadius: '8px' }}
      />
      <Typography
        sx={{ color: '#86868b', mt: 1.5, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
      >
        {alt}
      </Typography>
    </Box>
  );
}

function MobileScreenshotRow({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <Box
      sx={{
        my: 3,
        p: 2,
        borderRadius: '16px',
        backgroundColor: '#fbfbfd',
        border: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {images.map((img, idx) => (
        <Box
          key={idx}
          sx={{
            flex: '0 1 auto',
            maxWidth: { xs: '45%', sm: '22%' },
            height: { xs: 300, sm: 480 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }}
          />
        </Box>
      ))}
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

function YouTubeEmbed({ title, videoId }: { title: string; videoId: string }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em', mb: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%',
          height: 0,
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </Box>
    </Box>
  );
}

function YouTubeGrid({ videos }: { videos: { title: string; videoId: string }[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2.5,
        my: 3,
        p: 2.5,
        borderRadius: '16px',
        backgroundColor: '#fbfbfd',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {videos.map((video) => (
        <YouTubeEmbed key={video.videoId} {...video} />
      ))}
    </Box>
  );
}

const img = (name: string) => `/images/knowledge/mhe/${name}`;

export default function CitizenMheGuidePage() {
  const t = useTranslations();

  const tocItems = [
    { id: 'create-account', label: '1. Create Your Account & Log In' },
    { id: 'onboarding', label: '2. Onboarding' },
    { id: 'subscribe-service', label: '3. Subscribe to a Health Service' },
    { id: 'share-region', label: '4. Share Health Data with Your Region' },
    { id: 'connect-devices', label: '5. Connect Devices' },
    { id: 'measurements', label: '6. Take Measurements' },
    { id: 'questionnaires', label: '7. Questionnaires' },
    { id: 'next-of-kin', label: '8. Share Data with Next of Kin' },
    { id: 'insight-services', label: '9. Insight Services' },
    { id: 'support', label: '10. Support' },
    { id: 'data-governance', label: '11. Data Governance & Privacy' },
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
          }}
        >
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
      <Section id="create-account" title="1. Create Your Account & Log In">
        <Para>
          After downloading the MyHealthEnabler app, open it and follow these steps to create your account:
        </Para>
        <BulletList items={[
          'Choose your country from the list (Sweden, Norway, Spain, or Great Britain)',
          'For Norway, Spain, or Great Britain: select a user name and password, then log in with two-factor authentication (2FA) using SMS',
          'For Sweden: use BankID to create your account and log in securely',
          'Once registered, you now have a MyHealthEnabler user account',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p2-4.webp'), alt: 'Create account' },
          { src: img('mhe-p2-1.jpeg'), alt: 'Login screen' },
          { src: img('mhe-p2-2.jpeg'), alt: 'Country selection' },
          { src: img('mhe-p2-3.jpeg'), alt: 'Email and password' },
          { src: img('mhe-p2-4.jpeg'), alt: 'Two-factor authentication' },
          { src: img('mhe-p4-5.jpeg'), alt: 'Account created - Welcome to MyHealthEnabler' },
        ]} />
      </Section>

      {/* Section 2: Onboarding */}
      <Section id="onboarding" title="2. Onboarding">
        <Para>
          When you log in for the first time, you will go through a 4-step onboarding process:
        </Para>
        <SubHeading>Step 1: Personal Details</SubHeading>
        <Para>
          Enter your personal information such as username, email address, street name, zip code, and city. Make sure the details are correct as they will be used for your health profile.
        </Para>
        <SubHeading>Step 2: Choose Your Region</SubHeading>
        <Para>
          Select your home region from the list. Your healthcare provider in your region will not be able to access your health data until you choose to share it. You can subscribe to share your data with your region from the Services section later.
        </Para>
        <SubHeading>Step 3: Share Your Data for a Good Cause</SubHeading>
        <Para>
          You can choose to share your health data anonymously for research purposes, supporting the development of new and more efficient medicine. Sharing is always safe and optional. Review the data agreement and terms of services for details.
        </Para>
        <SubHeading>Step 4: Get Started</SubHeading>
        <Para>
          Choose to start an introduction to explore the features and benefits of MyHealthEnabler, or skip and start using the app directly. You can access the introduction at any time from the Support section.
        </Para>
        <MobileScreenshotRow images={[
          { src: img('mhe-p4-5.jpeg'), alt: 'Welcome to MyHealthEnabler' },
          { src: img('mhe-p4-4.png'), alt: 'Step 1 - Personal details' },
          { src: img('mhe-p4-3.png'), alt: 'Step 2 - Choose region' },
          { src: img('mhe-p4-2.png'), alt: 'Step 3 - Share data' },
          { src: img('mhe-p4-1.png'), alt: 'Step 4 - All set' },
        ]} />
      </Section>

      {/* Section 3: Subscribe to Health Service */}
      <Section id="subscribe-service" title="3. Subscribe to a Health Service">
        <Para>
          MyHealthEnabler offers several health services you can subscribe to. Each service is tailored for a specific condition and enables you to track relevant health data.
        </Para>
        <BulletList items={[
          'Choose Services from the menu',
          'Browse the available prescribed services: Diabetes, COPD package, Cardiovascular, and more',
          'Press Subscribe on the service you wish to use',
          'Read the data agreement carefully and press Subscribe to confirm',
          'You can return to the service list and unsubscribe at any time',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p6-1.jpeg'), alt: 'Home screen - Select service' },
          { src: img('mhe-p6-2.jpeg'), alt: 'Services list' },
          { src: img('mhe-p6-3.png'), alt: 'COPD package details' },
          { src: img('mhe-p6-4.png'), alt: 'Subscribed services' },
        ]} />
      </Section>

      {/* Section 4: Share Health Data with Region */}
      <Section id="share-region" title="4. Share Health Data with Your Region">
        <Para>
          You can share your health data with the healthcare providers in your region so they can better support your care.
        </Para>
        <BulletList items={[
          'Choose Services from the menu and scroll down to the sharing services section',
          'Press Share data on the sharing service you wish to subscribe to (e.g. Share COPD health data or Share diabetes health data with your region)',
          'Read the data agreement and press Share data to confirm',
          'You can return to the service list and unsubscribe from the sharing service at any time',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p7-1.png'), alt: 'Sharing services list' },
          { src: img('mhe-p7-2.png'), alt: 'Share COPD health data confirmation' },
        ]} />
      </Section>

      {/* Section 5: Connect Devices */}
      <Section id="connect-devices" title="5. Connect Devices & Start Measuring">
        <Para>
          To take health measurements, you need to connect your medical devices to the app via Bluetooth. MyHealthEnabler supports the following devices:
        </Para>
        <BulletList items={[
          'Blood pressure monitor',
          'Pulse oximeter',
          'Temperature sensor',
          'Blood sugar (glucose) meter',
          'Body scale',
        ]} />
        <SubHeading>How to Connect a Device</SubHeading>
        <BulletList items={[
          'Open the menu and choose Devices',
          'Press Connect on the device type you want to connect',
          'Make sure Bluetooth is activated on both your mobile phone and the medical device',
          'The app will search for nearby devices - select your device from the list',
          'Once connected, you will see a confirmation message',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p9-2.png'), alt: 'Menu with Devices option' },
          { src: img('mhe-p9-3.png'), alt: 'Connect device screen' },
          { src: img('mhe-p9-4.png'), alt: 'Searching for devices' },
          { src: img('mhe-p9-5.png'), alt: 'Device connected confirmation' },
        ]} />
        <Box
          sx={{
            my: 3,
            textAlign: 'center',
            p: 2,
            borderRadius: '16px',
            backgroundColor: '#fbfbfd',
            border: '1px solid rgba(0,0,0,0.04)',
            maxWidth: 300,
            mx: 'auto',
          }}
        >
          <img
            src={img('mhe-p10-2.png')}
            alt="Device list showing connected and disconnected devices"
            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '8px' }}
          />
          <Typography
            sx={{ color: '#86868b', mt: 1.5, fontSize: '13px', fontStyle: 'italic', letterSpacing: '-0.01em' }}
          >
            Device list showing connected and disconnected devices
          </Typography>
        </Box>

        <SubHeading>Device Instruction Videos</SubHeading>
        <Para>
          Watch these video guides to learn how to properly use each medical device with the MyHealthEnabler app:
        </Para>
        <YouTubeGrid videos={[
          { title: 'Blood Pressure Monitor', videoId: 'y7DfCmw6Tu4' },
          { title: 'Pulse Oximeter', videoId: '31EwM22ukiM' },
          { title: 'Blood Sugar (Glucose) Meter', videoId: 'XTfvh8eQehM' },
        ]} />
      </Section>

      {/* Section 6: Measurements */}
      <Section id="measurements" title="6. Take Measurements">
        <Para>
          Once you have subscribed to a health service (such as COPD, Diabetes, or Cardiovascular), the related measurements will appear on your Overview screen.
        </Para>
        <BulletList items={[
          'Your daily tasks will show which measurements need to be taken (e.g. Oxygen level, Weight)',
          'Press "Measure now" to begin the measurement flow',
          'Before you start, the app will show you what devices you need and whether they are connected',
          'Follow the step-by-step flow to complete each measurement',
          'Save your measurements to complete the flow',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p11-1.webp'), alt: 'Overview - Today\'s tasks with measurements' },
          { src: img('mhe-p11-2.webp'), alt: 'Before you start measuring - device checklist' },
        ]} />
      </Section>

      {/* Section 7: Questionnaires */}
      <Section id="questionnaires" title="7. Questionnaires">
        <Para>
          When you subscribe to a health service, related health questionnaires will be displayed on your Overview screen alongside your measurements.
        </Para>
        <BulletList items={[
          'Press "Respond now" on the Overview screen to see available questionnaires',
          'Select the questionnaire you want to respond to',
          'Answer the questions and save your responses when done',
          'Your answers are then visible in the History section under the Surveys tab',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p11-1.webp'), alt: 'Daily tasks with questionnaires' },
          { src: img('mhe-p11-2.webp'), alt: "Today's questionnaires" },
          { src: img('mhe-p11-3.webp'), alt: "COPD questionnaire start screen" },
          { src: img('mhe-p11-4.webp'), alt: 'COPD questionnaire - How are you feeling overall right now?' },
          { src: img('mhe-p11-5.webp'), alt: 'History logs for questionnaires taken' },
          { src: img('mhe-p11-6.webp'), alt: 'History log - Survey responses for a specific day' },
        ]} />
      </Section>

      {/* Section 8: Share Data with Next of Kin */}
      <Section id="next-of-kin" title="8. Share Health Data with Your Next of Kin">
        <Para>
          You can invite a family member or trusted person as your next of kin, allowing them to view your health measurements and activity through the MyHealthEnabler app.
        </Para>
        <SubHeading>How to Invite Your Next of Kin</SubHeading>
        <BulletList items={[
          'Go to Profile in the menu and choose Next of kin',
          'Enter the identity number and email address of your next of kin',
          'Press Send invitation - they will receive an email notification',
          'You can remove your next of kin at any time from your profile',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p13-1.webp'), alt: 'Profile screen - Next of kin option' },
          { src: img('mhe-p13-3.webp'), alt: 'Invite next of kin form' },
          { src: img('mhe-p13-2.webp'), alt: 'Next of kin list with invitation status' },
        ]} />
        <SubHeading>Next of Kin View</SubHeading>
        <Para>
          When you send the invitation, your next of kin will receive an email notifying them of the pending invitation. They can then:
        </Para>
        <BulletList items={[
          'Download the MyHealthEnabler app and create their own account',
          'Log in and accept the invitation to become next of kin',
          'Once accepted, they can view your measurements and questionnaire answers',
          'They can switch between their own profile and yours using the profile selector at the top of the app',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p13-3.jpeg'), alt: 'Next of kin option' },
          { src: img('mhe-p14-1.jpeg'), alt: 'Next of kin dashboard - measurements and questionnaires' },
          { src: img('mhe-p14-2.jpeg'), alt: 'Next of kin history view' },
        ]} />
      </Section>

      {/* Section 9: Insight Services */}
      <Section id="insight-services" title="9. Insight Services">
        <Para>
          Insight services provide intelligent analysis of your health data and send you personalised reports and recommendations.
        </Para>
        <BulletList items={[
          'Choose Services from the menu',
          'Scroll to the Insights section and press Subscribe on the insight service you want (e.g. Diabetes Health Insights)',
          'This service combines your blood sugar data with your activity data and sends you an email report weekly with your status and recommendations',
          'Enter your email address and choose the report frequency',
          'You can also choose to share the insight report with your doctor',
          'You can unsubscribe from the insight service at any time',
        ]} />
        <MobileScreenshotRow images={[
          { src: img('mhe-p16-1.png'), alt: 'Services - Insights section' },
          { src: img('mhe-p16-2.jpeg'), alt: 'Diabetes Health Insights - email settings' },
        ]} />
      </Section>

      {/* Section 10: Support */}
      <Section id="support" title="10. Support">
        <Para>
          If you need help, the Support section in the app provides everything you need:
        </Para>
        <BulletList items={[
          'Contact information (email and phone number) to reach the support team',
          'A multi-step introduction to the app that you can restart at any time',
          'A list of Frequently Asked Questions (FAQ) with answers to common issues',
        ]} />
        <Para>
          To access Support, open the menu and tap on Support.
        </Para>
        <MobileScreenshotRow images={[
          { src: img('mhe-p18-1.png'), alt: 'Menu with Support option' },
          { src: img('mhe-p18-2.png'), alt: 'Support page - Contact us & FAQ' },
        ]} />
      </Section>

      {/* Section 11: Data Governance & Privacy */}
      <Section id="data-governance" title="11. Data Governance & Privacy">
        <Para>
          MyHealthEnabler is part of the CRANE d-HDSI dataspace, which follows a strict governance framework to protect your personal health data. This section explains how the dataspace handles your data agreements, consent, digital identity, and privacy — giving you full control over what is shared and with whom.
        </Para>
      </Section>
      <CitizenGuideContent appName="MyHealthEnabler" showIntro={false} />

    </KnowledgeHubLayout>
  );
}
