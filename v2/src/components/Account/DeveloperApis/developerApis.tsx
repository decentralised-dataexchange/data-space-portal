"use client"
import { CopyIcon, EyeIcon, EyeClosedIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import "../style.scss";
import SnackbarComponent from "@/components/notification";
import { useGetAdminDetails, useGetOrganizationDetails, useUpdateOpenApiUrl, useGetApiToken } from "@/custom-hooks/developerApis";

const Container = styled("div")(({ theme }) => ({
  margin: "0 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: "10px",
});

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
});

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  padding: 10,
  paddingLeft: 20,
  height: "auto",
  borderRadius: 2,
  border: "1px solid #CECECE",
}));

export default function DeveloperAPIs () {
  const [showAPI, setShowAPI] = useState(false);
  const t = useTranslations();
  const { getFormattedToken } = useGetApiToken();
  const token = getFormattedToken();
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch admin details using React Query
  const { data: adminData, isLoading: adminLoading, isError: adminError } = useGetAdminDetails();
  const userId = adminData?.id || "";

  // Fetch organization details using React Query
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useGetOrganizationDetails();
  const orgDetails = orgData?.dataSource;

  // Update OpenAPI URL mutation
  const { mutate: updateOpenApiUrl, isPending: isUpdating } = useUpdateOpenApiUrl();

  // Set the OpenAPI URL when organization data is loaded
  useEffect(() => {
    if (orgDetails?.openApiUrl) {
      setOpenApiUrl(orgDetails.openApiUrl);
    }
  }, [orgDetails]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setOpenSnackBar(true);
    setSuccess(t("developerAPIs.apiKeyCopied"));
  };

  const handleUpdateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenApiUrl(event.target.value);
    event.target.value !== orgDetails?.openApiUrl
      ? setIsOk(true)
      : setIsOk(false);
  };

  const udateOpenApiUrls = () => {
    if (isOk) {
      const payload = {
        dataSource: {
          openApiUrl: openApiUrl,
        },
      };
      
      updateOpenApiUrl(payload, {
        onSuccess: () => {
          setOpenSnackBar(true);
          setSuccess(t("developerAPIs.openApiUpdated"));
          setIsOk(false);
        },
        onError: () => {
          setOpenSnackBar(true);
          setError(t("developerAPIs.openApiUpdateFailed"));
        }
      });
    }
  };

  // Show loading state if any data is loading
  if (adminLoading || orgLoading) {
    return (
      <Container>
        <HeaderContainer>
          <Typography variant="h6" fontWeight="bold">
            {t("developerAPIs.headerText")}
          </Typography>
        </HeaderContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Show error state if any data failed to load
  if (adminError || orgError) {
    return (
      <Container>
        <HeaderContainer>
          <Typography variant="h6" fontWeight="bold">
            {t("developerAPIs.headerText")}
          </Typography>
        </HeaderContainer>
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="h6">
            {t("common.errorOccurred") || "An error occurred"}
          </Typography>
          <Typography variant="body1">
            {t("common.tryAgainLater") || "Please try again later"}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <SnackbarComponent
          open={openSnackBar}
          setOpen={setOpenSnackBar}
          message={error}
          topStyle={100}
          successMessage={success}
        />
        <Typography variant="h6" fontWeight="bold">
          {t("developerAPIs.headerText")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer>
        <Typography variant="body2" mt={1.25} mb={1}>
          {t("developerAPIs.pageDescription")}
        </Typography>
        <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.organizationID")}
              </Typography>
              <Typography color="grey" variant="body2">
                {orgDetails?.id}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.yourUserID")}
              </Typography>
              <Typography color="grey" variant="body2">
                {userId}
              </Typography>
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.configuredBaseURL")}
              </Typography>
              <Typography color="grey" variant="body2">
                https://api.nxd.foundation{" "}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </DetailsContainer>
      <Box className="apiKey">
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <Typography
              color="black"
              variant="subtitle1"
              fontWeight="bold"
              mb={0.5}
            >
              {t("developerAPIs.apiKey")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 11 }}>
            <Typography color="grey" variant="body1" className="description">
              {showAPI
                ? token || t("developerAPIs.noTokenAvailable")
                : "************************************************************************************************************************************************************************************"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 1 }}>
            <Box
              className="actionBtnContainer pointer d-flex-evenly"
              sx={{ cursor: "pointer" }}
            >
              {showAPI ? (
                <EyeIcon
                  onClick={() => setShowAPI(false)}
                  size={24}
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowAPI(true)}
                  size={24}
                />
              )}

              <CopyIcon
                size={24}
                onClick={handleCopy}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box className="apiKey">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.configureOpenApi")}
              </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2 }}>
            <Typography color="grey" variant="body1" className="description">
              {t("developerAPIs.openApiUrlLabel")} 
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              value={openApiUrl}
              onChange={handleUpdateUrl}
              size="small"
              disabled={isUpdating}
              sx={{ marginTop: "5px", borderRadius: '0px' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
            <Button
              variant="outlined"
              onClick={udateOpenApiUrls}
              disabled={!isOk || isUpdating}
              sx={{
                width: "auto",
                marginRight: "20px",
                cursor: (!isOk || isUpdating) ? "not-allowed" : "pointer",
                color: (!isOk || isUpdating) ? "#6D7676" : "black",
                height: "40px",
                border: "1px solid #DFDFDF",
                borderRadius: "0px",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              {isUpdating ? <CircularProgress size={20} /> : t("developerAPIs.uploadButton")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
