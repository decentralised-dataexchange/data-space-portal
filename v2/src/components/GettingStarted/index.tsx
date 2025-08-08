
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
  
  useUpdateDataSource,
  useUpdateCoverImage,
  useGetVerificationTemplate,
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
  backgroundColor: "#fff",
  padding: theme.spacing(1),
  justifyContent: "center",
  color: "#000",
  height: 'auto',
  minHeight: 90,
  borderRadius: 0,
  border: "1px solid #DFDFDF",
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  textTransform: 'unset',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#000',
    color: '#fff',
    '& .MuiTypography-root': {
      color: '#fff',
    }
  },
  '& .MuiTypography-root': {
    color: '#000',
    fontSize: '14px',
    textAlign: 'center',
    width: '100%',
    padding: '6px 16px',
    margin: '8px 0 0 0',
  }
}));

const GettingStarted = () => {
  const [editMode, setEditMode] = useState(false);
  const t = useTranslations();
  const router = useRouter();

  const { data: gettingStartData, isLoading: isGettingStartLoading } = useGetGettingStartData();
  const { data: listConnections } = useListConnections(10, 0, false);
  const { data: coverImageBase64, isLoading: isCoverImageLoading } = useGetCoverImage();
  
  const isEnableAddCredential = listConnections?.connections && listConnections?.connections.length > 0 && 
    listConnections?.connections[0]?.connectionState === 'active';

  const [formData, setFormData] = useState<any>({});

  // Initialize form data when data is loaded
  useEffect(() => {
    if (gettingStartData?.dataSource) {
      setFormData({
        name: gettingStartData.dataSource.name || '',
        location: gettingStartData.dataSource.location || '',
        policyUrl: gettingStartData.dataSource.policyUrl || '',
        description: gettingStartData.dataSource.description || '',
        sector: gettingStartData.dataSource.sector || ''
      });
    }
  }, [gettingStartData]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({
      ...prev,
      [field]: value
    }));
  };

  // Mutation hooks
  const { mutateAsync: updateDataSource } = useUpdateDataSource();
  const { mutateAsync: updateCoverImage } = useUpdateCoverImage();

  // Logo image upload is fully handled inside OrgLogoImageUpload via React Query

  const handleCoverImageChange = async (newImage: string) => {
    try {
      const formData = new FormData();
      formData.append('file', newImage);
      await updateCoverImage(formData);
    } catch (error) {
      console.error('Error updating cover image:', error);
    }
  };

  const isLoading = useMemo(() => {
    const loading = isGettingStartLoading || isCoverImageLoading;
    return loading;
  }, [isGettingStartLoading, isCoverImageLoading]);

  const hasError = useMemo(() => {
    const error = !isLoading && (!gettingStartData || !gettingStartData.dataSource);
    console.log('Error state evaluation:', {
      isLoading,
      gettingStartDataExists: !!gettingStartData,
      gettingStartDataHasDataSource: !!gettingStartData?.dataSource,
      hasError: error
    });
    return error;
  }, [isLoading, gettingStartData]);

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
        handleEdit={handleEdit}
      />
      <OrganisationDetailsContainer
        editMode={editMode}
        handleEdit={handleEdit}
        isEnableAddCredential={isEnableAddCredential ?? false}
        organisationDetails={formData}
        setOganisationDetails={handleFormChange}
      />

      <DetailsContainer sx={{ flexGrow: 1, marginTop: "15px" }}>
        <Grid container spacing={2}>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item as="button" onClick={() => router.push(`/${t("route.dd-agreements")}`)}>
              <Typography variant="body1">
                {t('gettingStarted.manageDDA')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs:12}}>
            <Item as="button" onClick={() => router.push(`/${t("route.manageAdmin")}`)}>
              <Typography variant="body1">
                {t('gettingStarted.manageAdminUser')}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{lg: 4, md: 6, sm: 6, xs: 12}}>
            <Item as="button" onClick={() => router.push(`/${t("route.developerApis")}`)}>
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
