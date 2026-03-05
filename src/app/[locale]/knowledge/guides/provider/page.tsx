"use client";

import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
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

export default function ProviderGuidePage() {
  const t = useTranslations();
  const img = (name: string) => `/images/knowledge/${name}`;

  const tocItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'create-account', label: 'Create an Account' },
    { id: 'connect-wallet', label: 'Connect the Business Wallet' },
    { id: 'verify-org', label: 'Verify Organisational Legitimacy' },
    { id: 'accept-coc', label: 'Accept the Code of Conduct' },
    { id: 'configure-wallet-oauth', label: 'Configure Wallet & OAuth 2.0 Clients' },
    { id: 'publish-ddas', label: 'Publishing & Governance of DDAs' },
    { id: 'sign-ddas', label: 'Reviewing & Signing DDAs' },
    { id: 'appendix-da', label: 'Appendix: Data Exchange Agreements' },
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
          {t('knowledgeHub.guides.provider.title')}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '17px', md: '19px' },
            color: '#86868b',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          {t('knowledgeHub.guides.provider.subtitle')}
        </Typography>
      </Box>

      {/* Table of Contents */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: '20px',
          backgroundColor: '#f5f5f7',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', mb: 2, letterSpacing: '-0.01em' }}>
          Contents
        </Typography>
        <Box component="ol" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.8, fontSize: '14px' } }}>
          {tocItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                style={{ color: '#0071e3', textDecoration: 'none', letterSpacing: '-0.01em' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </Box>
      </Box>

      {/* 1. Overview */}
      <Section id="overview" title="1. Overview">
        <Para>
          This guide helps organisations (both Data Sources and Data Using Services) to onboard to the CRANE dHDSI Data Marketplace. It explains what the marketplace is, how trust works, and what an organisation needs to do in order to publish or consume data services.
        </Para>
        <GuideImage src={img('fig1-data-exchange-framework.png')} alt="Figure 1: Data Exchange Framework adopted in CRANE" />
        <Para>
          CRANE dHDSI provides a trusted framework for data exchange between verified organisations and individuals. Verified organisations and individuals exchange data by setting Data Agreements, issuing Data Disclosure Agreements, and using EUDI Wallets (for businesses and individuals) to authorise, delegate, and audit sharing under marketplace governance.
        </Para>
        <SubHeading>Key Roles</SubHeading>
        <Para>
          <strong>Marketplace Administrator:</strong> Oversees the entire ecosystem, managing data service listings, enforcing governance policies, and ensuring regulatory compliance across all marketplace activities.
        </Para>
        <Para>
          <strong>Organisation Administrator:</strong> Represents individual participating organisations, publishes data services to the marketplace, and negotiates agreements with other verified organisations to enable data exchange.
        </Para>
      </Section>

      {/* 2. Prerequisites */}
      <Section id="prerequisites" title="2. Prerequisites">
        <Para>
          Before you can join the Data Marketplace, your organisation must meet one of these conditions:
        </Para>
        <Box component="ul" sx={{ pl: 3, '& li': { mb: 1, fontSize: '15px', color: '#424245', lineHeight: 1.7, letterSpacing: '-0.01em' } }}>
          <li>You are already onboarded with a Data Intermediation Service Provider (DISP). The DISP provides consent management and digital wallet services.</li>
          <li>You have implemented equivalent functions (of adopting consent management and digital wallets) that meet the governance requirements.</li>
        </Box>
        <Para>
          This guide assumes your organisation is onboarded with a DISP. To begin, send an email to <strong>support@igrant.io</strong> to request the creation of your business wallet account. Once provisioned, your account will include Legal Person Identification Data (Legal PID) and Wallet Unit Attestation (WUA) credentials.
        </Para>
      </Section>

      {/* 3. Create an Account */}
      <Section id="create-account" title="3. Create an Account">
        <Para>Visit the Data Marketplace onboarding page to register your organisation.</Para>
        <SubHeading>Step 1: Enter the organisation administrator&apos;s details.</SubHeading>
        <GuideImage src={img('fig1-admin-details.png')} alt="Fig 1: Provide organisation administrator details" />
        <SubHeading>Step 2: Enter your organisation&apos;s details.</SubHeading>
        <GuideImage src={img('fig2-org-details.png')} alt="Fig 2: Provide organisation details" />
        <Para>Once both steps are completed, your Data Marketplace account will be created.</Para>
        <GuideImage src={img('fig3-account-created.png')} alt="Fig 3: Successful account creation" />
        <Para>After account creation, you can either click CONTINUE to proceed with onboarding or log in later to continue.</Para>
      </Section>

      {/* 4. Connect the Business Wallet */}
      <Section id="connect-wallet" title="4. Connect the Business Wallet">
        <Para>In the next step, provide the Business Wallet Address obtained from your DISP account.</Para>
        <GuideImage src={img('fig4-wallet-address.png')} alt="Fig 4: Provide business wallet address" />
        <Para>The Business Wallet Address can be copied from the Base Configurations page under Digital Wallet (OpenID4VC) in the DISP portal.</Para>
        <GuideImage src={img('fig5-base-configurations.png')} alt="Fig 5: Base configurations page" />
      </Section>

      {/* 5. Verify Organisational Legitimacy */}
      <Section id="verify-org" title="5. Verify Organisational Legitimacy">
        <Para>Once the organisation wallet is connected, the Data Marketplace will redirect to the wallet and request access to your Legal PID to verify the organisation&apos;s legitimacy. Click Confirm to approve.</Para>
        <GuideImage src={img('fig6-verify-legal-pid.png')} alt="Fig 6: Verify Legal PID" />
        <Para>The administrator will then be redirected back to the Data Marketplace and shown a preview of the Legal PID.</Para>
      </Section>

      {/* 6. Accept the Code of Conduct */}
      <Section id="accept-coc" title="6. Accept the Code of Conduct">
        <Para>The organisation administrator is presented with the Data Marketplace Code of Conduct. Review the document carefully, then click SIGN AND CONTINUE to proceed.</Para>
        <GuideImage src={img('fig7-code-of-conduct.jpg')} alt="Fig 7: Review and sign code of conduct" />
        <Para>Once signed, the organisation is successfully onboarded. The administrator will be redirected to the Getting Started page.</Para>
        <GuideImage src={img('fig8-getting-started.png')} alt="Fig 8: Getting started page" />
      </Section>

      {/* 7. Configure Wallet & OAuth 2.0 Clients */}
      <Section id="configure-wallet-oauth" title="7. Configure Wallet & OAuth 2.0 Clients">
        <Para>To enable secure, bi-directional communication between the DISP and the Data Marketplace, the organisation administrator must configure the organisation wallet and OAuth 2.0 clients.</Para>

        <SubHeading>7.1 Access Developer APIs</SubHeading>
        <Para>Navigate to the Developer APIs page in the Data Marketplace.</Para>
        <GuideImage src={img('fig9-developer-apis.png')} alt="Fig 9: Developer APIs page" />

        <SubHeading>7.2 Configure Organisation Wallet</SubHeading>
        <Para>Click CONFIGURE next to Organisation Wallet Configuration.</Para>
        <GuideImage src={img('fig10-wallet-configuration.png')} alt="Fig 10: Organisation wallet configuration" />
        <Para><strong>Credential Offer Endpoint</strong> - found under Digital Wallet (OpenID4VC) → Base Configuration in the DISP portal.</Para>
        <GuideImage src={img('fig11-credential-offer-endpoint.png')} alt="Fig 11: Credential Offer Endpoint" />
        <Para><strong>Access Point Endpoint</strong> - found under Data Marketplace → Base Configuration in the DISP portal.</Para>
        <GuideImage src={img('fig12-access-point-endpoint.png')} alt="Fig 12: Access Point Endpoint" />

        <SubHeading>7.3 Request a Software Statement</SubHeading>
        <Para>Once both endpoints are configured, click Request Credential to initiate the issuance of a Software Statement to your connected business wallet.</Para>
        <GuideImage src={img('fig13-request-credential.png')} alt="Fig 13: Request Credential" />
        <Para>The Software Statement can be reviewed and accepted in the DISP portal under Digital Wallet (OpenID4VC) → Wallet Unit (Holder).</Para>
        <GuideImage src={img('fig14-software-statement.png')} alt="Fig 14: Software Statement notification" />

        <SubHeading>7.4 Configure OAuth 2.0 Client (Data Marketplace → DISP)</SubHeading>
        <Para>Click CONFIGURE next to the Data Marketplace OAuth 2.0 client. Provide a name and optional description, then click CREATE.</Para>
        <GuideImage src={img('fig15-oauth2-configure.png')} alt="Fig 15: Configure OAuth 2.0 client" />
        <Para>Copy the generated Client ID and Client Secret.</Para>
        <GuideImage src={img('fig16-oauth2-client.png')} alt="Fig 16: OAuth 2.0 Client credentials" />
        <Para>In the DISP portal, navigate to Data Marketplace → Base Configurations, click CONFIGURE and paste these values.</Para>
        <GuideImage src={img('fig17-oauth2-from-marketplace.png')} alt="Fig 17: Configure OAuth 2.0 from Data Marketplace" />

        <SubHeading>7.5 Configure OAuth 2.0 Client (DISP → Data Marketplace)</SubHeading>
        <Para>Within your DISP account, create a new OAuth 2.0 client for the Data Marketplace.</Para>
        <GuideImage src={img('fig18-oauth2-towards-marketplace.png')} alt="Fig 18: Configure OAuth 2.0 towards Data Marketplace" />
        <Para>Copy the generated Client ID and Client Secret.</Para>
        <GuideImage src={img('fig19-oauth2-disp-client.png')} alt="Fig 19: DISP OAuth 2.0 Client" />
        <Para>Return to the Data Marketplace and configure these under Organisation OAuth 2.0 Client.</Para>
        <GuideImage src={img('fig20-oauth2-from-disp.png')} alt="Fig 20: Configure OAuth 2.0 from DISP" />

        <SubHeading>7.6 Final Verification</SubHeading>
        <Para>Once both clients have been configured, bi-directional communication between the DISP and the Data Marketplace is successfully established.</Para>
      </Section>

      {/* 8. Publishing & Governance of DDAs */}
      <Section id="publish-ddas" title="8. Publishing & Governance of DDAs">
        <Para>The Data Source organisation administrator can create DDAs by linking existing Data Agreements within the DISP platform. Upon publication, each DDA appears on the Data Marketplace in an unlisted state.</Para>
        <GuideImage src={img('fig21-unlisted-ddas.png')} alt="Fig 21: Unlisted DDAs on the Dashboard" />
        <Para>The administrator may then request a review to make it available for discovery.</Para>
        <GuideImage src={img('fig22-request-review.png')} alt="Fig 22: Requesting a Review" />
        <Para>A designated Review Committee assesses the DDA for completeness, accuracy, and compliance. The committee may approve or reject the agreement.</Para>
        <GuideImage src={img('fig23-approved-dda.png')} alt="Fig 23: Approved DDA" />
        <Para>Following approval, the administrator can list the agreement, making it discoverable.</Para>
        <GuideImage src={img('fig24-listing-dda.png')} alt="Fig 24: Listing a DDA" />
        <Para>Once listed, the DDA becomes visible on the public discovery page.</Para>
        <GuideImage src={img('fig25-public-discovery.png')} alt="Fig 25: DDA on Public Discovery Page" />
      </Section>

      {/* 9. Reviewing & Signing DDAs */}
      <Section id="sign-ddas" title="9. Reviewing & Signing DDAs">
        <Para>The Data Using Service administrator can explore all available data sources on the public discovery page.</Para>
        <GuideImage src={img('fig26-public-discovery-page.png')} alt="Fig 26: Public Discovery Page" />
        <Para>To review a published DDA, select View Data Disclosure Agreement.</Para>
        <GuideImage src={img('fig27-viewing-dda.png')} alt="Fig 27: Viewing a DDA" />
        <Para>Access individual DDAs by clicking View Data Disclosure Agreements.</Para>
        <GuideImage src={img('fig28-single-dda.png')} alt="Fig 28: Single DDA view" />
        <Para>Examine the APIs available under each DDA by selecting View APIs.</Para>
        <GuideImage src={img('fig29-viewing-apis.png')} alt="Fig 29: APIs Associated with a DDA" />
        <Para>To sign, click Sign with Business Wallet. This redirects to the Business Wallet for signing using a Software Statement issued by the Data Marketplace.</Para>
        <GuideImage src={img('fig30-signing-dda.png')} alt="Fig 30: Signing a DDA" />
        <Para>The Signed Agreements page provides a complete audit trail of all signed agreements.</Para>
        <GuideImage src={img('fig31-signed-agreements.png')} alt="Fig 31: Signed Agreements" />
      </Section>

      {/* Appendix */}
      <Section id="appendix-da" title="Appendix: Creating Data Exchange Agreements">
        <SubHeading>A.1 Creating a Data Agreement in the DISP</SubHeading>
        <Para>To publish a DDA, a Data Agreement (DA) must be created first, defining the data-sharing relationship between an individual and an organisation.</Para>

        <SubHeading>A.1.1 Define Usage Purpose and Data Exchange Type</SubHeading>
        <Para>Navigate to Data Agreements and click Add (+). Provide the Usage Purpose, Description, and set Data Exchange to Data Source.</Para>
        <GuideImage src={img('figA1-create-data-agreement.png')} alt="Fig A1: Creating a new Data Agreement" />

        <SubHeading>A.1.2 Specify Lawful Basis and Data Policy</SubHeading>
        <Para>Select the Lawful Basis. Set Third-party Data Sharing to True to enable DDA creation.</Para>
        <GuideImage src={img('figA2-lawful-basis.png')} alt="Fig A2: Configuring lawful basis and data policy" />

        <SubHeading>A.1.3 Add Dataset and OpenAPI Specification</SubHeading>
        <Para>Define the dataset elements and provide an OpenAPI Specification outlining the APIs that Data Using Services can access.</Para>
        <GuideImage src={img('figA3-dataset-openapi.png')} alt="Fig A3: Dataset fields and OpenAPI specification" />

        <SubHeading>A.1.4 Save and Publish</SubHeading>
        <Para>Save the draft, then Publish to make it available.</Para>
        <GuideImage src={img('figA4-draft-agreement.png')} alt="Fig A4: Draft Data Agreement" />
        <GuideImage src={img('figA5-published-agreement.png')} alt="Fig A5: Published Data Agreement" />

        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.06)' }} />

        <SubHeading>A.2 Creating a DDA from a Data Agreement</SubHeading>
        <Para>Once a DA is published, a DDA can be created to govern data exchange between organisations.</Para>

        <SubHeading>A.2.1 Connect a Data Agreement</SubHeading>
        <Para>Navigate to Data Disclosure Agreements, click Add (+), and select the previously created DA.</Para>
        <GuideImage src={img('figA6-connect-data-agreement.png')} alt="Fig A6: Connecting a Data Agreement" />

        <SubHeading>A.2.2 Configure the DDA</SubHeading>
        <Para>Enter the Policy URL and adjust configurations as necessary.</Para>
        <GuideImage src={img('figA7-configure-dda.png')} alt="Fig A7: Configuring the DDA" />

        <SubHeading>A.2.3 Save and Publish</SubHeading>
        <Para>Save the draft, then Publish to make it available to the Data Marketplace.</Para>
        <GuideImage src={img('figA8-unpublished-dda.png')} alt="Fig A8: Unpublished DDA" />
        <GuideImage src={img('figA9-published-dda.png')} alt="Fig A9: Published DDA" />
      </Section>
    </KnowledgeHubLayout>
  );
}
