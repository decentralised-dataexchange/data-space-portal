
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import OrgCoverImageUpload from "@/components/OrganisationDetails/OrgCoverImageUpload";
import OrganisationDetailsContainer from "@/components/OrganisationDetails/OrgDetailsContainer";
import { useTranslations } from 'next-intl';
import Loader from "@/components/common/Loader";
import { 
  useGetGettingStartData, 
  useListConnections, 
  useGetCoverImage,
  useGetLogoImage,
  useGetVerificationTemplate
} from '@/custom-hooks/gettingStarted';

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
  backgroundColor: "#f7f6f6",
  padding: theme.spacing(1),
  justifyContent: "center",
  color: "#0000",
  height: 90,
  borderRadius: 7,
  border: "1px solid grey",
}));

const GettingStarted = () => {
  const [editMode, setEditMode] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  // Use React Query hooks instead of Redux actions directly
  const { data: gettingStartData, isLoading: isGettingStartLoading } = useGetGettingStartData();
  const { data: listConnections } = useListConnections(10, 0, false);
  const { data: coverImageBase64, isLoading: isCoverImageLoading } = useGetCoverImage();
  const { data: logoImageBase64, isLoading: isLogoImageLoading } = useGetLogoImage();
  const { refetch: fetchVerificationTemplate } = useGetVerificationTemplate();

  // Fetch verification template when connections are available
  useEffect(() => {
    if (listConnections?.connections?.length > 0) {
      fetchVerificationTemplate();
    }
  }, [listConnections, fetchVerificationTemplate]);

  const isEnableAddCredential = listConnections?.connections?.length > 0 && 
    listConnections?.connections[0]?.connectionState === 'active';

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  // Add detailed logging for debugging
  useEffect(() => {
    console.log('=== DEBUG START PAGE ===');
    console.log('Loading states:', { 
      isGettingStartLoading, 
      isCoverImageLoading, 
      isLogoImageLoading 
    });
    console.log('gettingStartData:', gettingStartData);
    console.log('coverImageBase64:', coverImageBase64 ? 'exists' : 'null/undefined');
    console.log('logoImageBase64:', logoImageBase64 ? 'exists' : 'null/undefined');
    console.log('listConnections:', listConnections);
  }, [isGettingStartLoading, isCoverImageLoading, isLogoImageLoading, gettingStartData, coverImageBase64, logoImageBase64, listConnections]);

  // Memoize the loading state to prevent unnecessary re-renders
  const isLoading = useMemo(() => {
    const loading = isGettingStartLoading || isCoverImageLoading || isLogoImageLoading;
    console.log('Combined loading state:', loading);
    return loading;
  }, [isGettingStartLoading, isCoverImageLoading, isLogoImageLoading]);

  // Handle error states with detailed logging
  const hasError = useMemo(() => {
    // The API response doesn't have a status field, so we just check if gettingStartData exists and has dataSource
    const error = !isLoading && (!gettingStartData || !gettingStartData.dataSource);
    console.log('Error state evaluation:', {
      isLoading,
      gettingStartDataExists: !!gettingStartData,
      gettingStartDataHasDataSource: !!gettingStartData?.dataSource,
      hasError: error
    });
    return error;
  }, [isLoading, gettingStartData]);

  // If still loading, show loader
  if (isLoading) {
    console.log('Rendering loader due to loading state');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader />
      </Box>
    );
  }

  // If there's an error, show error message
  if (hasError) {
    console.log('Rendering error message due to error state');
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t('errors.generic')}
        </Typography>
        <Typography variant="body2">
          {t('errors.generic')}
        </Typography>
      </Box>
    );
  }

  return (
    <Container className='pageContainer'>
      <OrgCoverImageUpload
        editMode={editMode}
        coverImageBase64={coverImageBase64 || ''}
        setCoverImageBase64={() => {}}
        handleEdit={handleEdit}
      />
      <OrganisationDetailsContainer
        editMode={editMode}
        logoImageBase64={logoImageBase64 || ''}
        handleEdit={() => { handleEdit() }}
        isEnableAddCredential={isEnableAddCredential}
        organisationDetails={gettingStartData?.dataSource}
        setOganisationDetails={() => {}}
        setLogoImageBase64={() => {}}
      />

      <DetailsContainer sx={{ flexGrow: 1, marginTop: "15px" }}>
        <Grid container spacing={2}>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/${t("route.dd-agreements")}`)}
            >
              <Typography variant="body1" color="grey">
                {t('gettingStarted.manageDDA')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/${t("route.manageAdmin")}`)}
            >
              <Typography variant="body1" color="grey">
              {t('gettingStarted.manageAdminUser')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs: 12}}>
            <Item
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/${t("route.developerApis")}`)}
            >
              <Typography variant="body1" color="grey">
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
