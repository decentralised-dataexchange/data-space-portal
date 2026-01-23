
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import OrgCoverImageUpload from "@/components/OrganisationDetails/OrgCoverImageUpload";
import OrganisationDetailsContainer from "@/components/OrganisationDetails/OrgDetailsContainer";
import { useTranslations } from 'next-intl';
import Loader from "@/components/common/Loader";
import { 
  useGetOrganisation,
  useGetOrgIdentity,
  useCreateOrgIdentity,
  useGetCoverImage,
  useGetLogoImage,
  useOrgIdentityPolling,
} from '@/custom-hooks/gettingStarted';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/custom-hooks/store';
import { useOnboardingGuard } from '@/custom-hooks/useOnboardingGuard';

const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "52px 0 10px 0",
  },
}));

const DetailsContainer = styled("div")({
  height: "auto",
  width: 'auto',
  borderRadius: 2,
  backgroundColor: "#FFFFF",
});

const Item = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: theme.spacing(1),
  justifyContent: "center",
  color: "#000",
  height: 'auto',
  minHeight: 90,
  border: "1px solid #DFDFDF",
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  width: '100%',
  textAlign: 'center',
  borderRadius: "7px",
  '&:hover': {
    backgroundColor: 'rgb(245,245,245)',
    border: "1px solid rgb(153,153,153)",
    color: 'black',
    '& .MuiTypography-root': {
      color: 'black',
    }
  },
  '& .MuiTypography-root': {
    color: '#000',
    fontSize: '14px',
    textAlign: 'center',
    width: '100%',
    padding: '6px 16px',
    margin: '8px 0 0 0',
    textTransform: 'capitalize',
  }
}));

const GettingStarted = () => {
  const [editMode, setEditMode] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Guard: Redirect to onboarding if CoC is not signed
  const { isCheckingOnboarding, onboardingComplete } = useOnboardingGuard();

  const { data: organisationResponse, isLoading: isOrganisationLoading } = useGetOrganisation();
  const { data: coverImageBase64, isLoading: isCoverImageLoading } = useGetCoverImage();
  const { data: logoImageBase64 } = useGetLogoImage();
  const organisationId = organisationResponse?.organisation?.id || 'current';
  const { data: orgIdentityResp } = useGetOrgIdentity(organisationId);
  const { mutateAsync: createOrgIdentity } = useCreateOrgIdentity();
  const queryClient = useQueryClient();
  const pollTimers = useRef<number[]>([]);
  
  const [formData, setFormData] = useState<any>({});
  // Hooks for Add Credential should be declared before any early returns
  const addInFlight = useRef(false);
  const [isAddLoading, setIsAddLoading] = useState(false);



  // Initialize form data when data is loaded
  useEffect(() => {
    const org = organisationResponse?.organisation;
    if (org) {
      setFormData({
        name: org.name || '',
        location: org.location || '',
        policyUrl: org.policyUrl || '',
        description: org.description || '',
        sector: org.sector || ''
      });
    }
  }, [organisationResponse]);

  // Use hook to handle polling lifecycle
  useOrgIdentityPolling(orgIdentityResp, organisationId);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({
      ...prev,
      [field]: value
    }));
  };

  const isLoading = useMemo(() => {
    // Only consider loading states when authenticated
    if (!isAuthenticated) return false;
    // Include onboarding guard check to prevent flicker
    return isCheckingOnboarding || isOrganisationLoading || isCoverImageLoading;
  }, [isAuthenticated, isCheckingOnboarding, isOrganisationLoading, isCoverImageLoading]);

  const hasError = useMemo(() => {
    // Do not show page-level error when unauthenticated (during logout redirect)
    if (!isAuthenticated) return false;
    return !isLoading && (!organisationResponse || !organisationResponse.organisation);
  }, [isAuthenticated, isLoading, organisationResponse]);

  // During logout, avoid rendering content that could flash an error state.
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error" gutterBottom sx={{ fontSize: '20px' }}>
          {t('errors.generic')}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          {t('errors.generic')}
        </Typography>
      </Box>
    );
  }

  const isVerified = !!orgIdentityResp?.verified;
  const addCredentialUrl = (orgIdentityResp as any)?.organisationalIdentity?.vpTokenQrCode as string | undefined;
  const isEnableAddCredential = !isVerified; // Show until verified becomes true

  const handleAddCredentialsClick = async () => {
    if (isVerified) return;
    if (addInFlight.current) return;
    addInFlight.current = true;
    try {
      const identityObj = (orgIdentityResp as any)?.organisationalIdentity;

      setIsAddLoading(true);
      const created = await createOrgIdentity();
      const newQr = (created as any)?.organisationalIdentity?.vpTokenQrCode as string | undefined;
      if (newQr) {
        window.location.href = newQr;
      } else {
        console.error('No vpTokenQrCode returned from createOrgIdentity');
      }
    } catch (e) {
      console.error('Error handling Add Credential click:', e);
    } finally {
      setIsAddLoading(false);
      addInFlight.current = false;
    }
  };

  return (
    <Container className='pageContainer'>
      <OrgCoverImageUpload
        editMode={editMode}
        coverImageBase64={coverImageBase64 || ''}
        handleEdit={handleEdit}
      />
      <OrganisationDetailsContainer
        editMode={editMode}
        handleEdit={handleEdit}
        isEnableAddCredential={isEnableAddCredential}
        originalOrganisation={organisationResponse?.organisation}
        isVerified={isVerified}
        addCredentialUrl={addCredentialUrl}
        onAddCredentialsClick={handleAddCredentialsClick}
        addCredentialsLoading={isAddLoading}
        coverImageBase64={coverImageBase64 || ''}
        logoImageBase64={logoImageBase64 || ''}
        orgIdentity={orgIdentityResp}
        organisationDetails={formData}
        setOganisationDetails={handleFormChange}
      />

      <DetailsContainer sx={{ flexGrow: 1, marginTop: "15px" }}>
        <Grid container spacing={2}>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item as="button" onClick={() => router.push('/dd-agreements')}>
              <Typography variant="body1">
                {t('gettingStarted.manageDDA')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item as="button" onClick={() => router.push('/account/manage-admin')}>
              <Typography variant="body1">
                {t('gettingStarted.manageAdminUser')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs: 12}}>
            <Item as="button" onClick={() => router.push('/account/developer-apis')}>
              <Typography variant="body1">
                {t('gettingStarted.developerDocumentation')}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </DetailsContainer>
    </Container>
  );
};

export default GettingStarted;
