"use client"
import { CopyIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import "../style.scss";
import { useGetAdminDetails, useGetOrganizationDetails, useUpdateOpenApiUrl, useGetApiToken, useGetOAuth2Clients, useCreateOAuth2Client, useUpdateOrganisation } from "@/custom-hooks/developerApis";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { setMessage, setOAuth2Client } from "@/store/reducers/authReducer";
import { baseURL } from "@/constants/url";

const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "52px 0 10px 0",
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
  const [showClientName, setShowClientName] = useState(false);
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [clientName, setClientName] = useState("");
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { getFormattedToken } = useGetApiToken();
  const token = getFormattedToken();
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [owsBaseUrl, setOwsBaseUrl] = useState("");
  const [isOwsDirty, setIsOwsDirty] = useState(false);
  const { data: oauth2List, isLoading: oauth2Loading } = useGetOAuth2Clients();
  const { mutate: createOAuth2Client, isPending: isCreating } = useCreateOAuth2Client();
  const oauth2Client = useAppSelector((state) => state.auth.oauth2Client);

  // Fetch admin details using React Query
  const { data: adminData, isLoading: adminLoading, isError: adminError } = useGetAdminDetails();
  const userId = adminData?.id || "";

  // Fetch organization details using React Query
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useGetOrganizationDetails();
  const orgDetails = (orgData?.organisation ?? orgData?.dataSource);

  // Update OpenAPI URL mutation
  const { mutate: updateOpenApiUrl, isPending: isUpdating } = useUpdateOpenApiUrl();
  const { mutate: updateOrganisation, isPending: isSavingOws } = useUpdateOrganisation();

  // Set the OpenAPI URL when organization data is loaded
  useEffect(() => {
    if (orgDetails?.openApiUrl) {
      setOpenApiUrl(orgDetails.openApiUrl);
    }
    if (orgDetails?.owsBaseUrl) {
      setOwsBaseUrl(orgDetails.owsBaseUrl);
    }
  }, [orgDetails]);

  // Store first OAuth2 client in Redux when fetched
  useEffect(() => {
    const first = oauth2List?.oAuth2Clients?.[0];
    if (first) {
      dispatch(setOAuth2Client(first));
    }
  }, [oauth2List, dispatch]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    // Success toasts suppressed globally; no local snackbar on copy
  };

  const handleOwsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setOwsBaseUrl(val);
    setIsOwsDirty(val !== (orgDetails?.owsBaseUrl ?? ""));
  };

  const handleSaveOws = () => {
    if (!orgDetails?.id) return;
    if (!isOwsDirty) return;
    const payload = {
      organisation: {
        ...orgDetails,
        owsBaseUrl: owsBaseUrl,
      }
    } as unknown as { organisation: any };
    updateOrganisation(payload as any, {
      onSuccess: () => {
        setIsOwsDirty(false);
      },
      onError: () => {
        dispatch(setMessage(t("developerAPIs.owsBaseUrlUpdateFailed")));
      }
    });
  };

  const handleCopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const handleCreateClient = () => {
    if (!clientName.trim()) return;
    createOAuth2Client(
      { name: clientName.trim() },
      {
        onSuccess: (res) => {
          if (res?.oAuth2Client) {
            dispatch(setOAuth2Client(res.oAuth2Client));
            setClientName("");
          }
        },
        onError: () => {
          dispatch(setMessage(t("error.generic")));
        }
      }
    );
  };

  const handleUpdateUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenApiUrl(event.target.value);

    if (event.target.value !== orgDetails?.openApiUrl) {
      setIsOk(true);
    } else {
      setIsOk(false);
    }
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
          // Success toasts suppressed globally; do not open snackbar
          setIsOk(false);
        },
        onError: () => {
          dispatch(setMessage(t("developerAPIs.openApiUpdateFailed")));
        }
      });
    }
  };

  // Show loading state if any data is loading
  if (adminLoading || orgLoading || oauth2Loading) {
    return (
      <Container>
        <HeaderContainer>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
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
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
            {t("developerAPIs.headerText")}
          </Typography>
        </HeaderContainer>
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="h6" sx={{ fontSize: '20px' }}>
            {t("common.errorOccurred") || "An error occurred"}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '14px' }}>
            {t("common.tryAgainLater") || "Please try again later"}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container className='pageContainer'>
      <HeaderContainer>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
          {t("developerAPIs.headerText")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer>
        <Typography variant="body2" mt={1.25} mb={1} sx={{ fontSize: '14px' }}>
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
                {baseURL}
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
              placeholder={t("developerAPIs.openApiUrlPlaceholder")}
              variant="standard"
              size="small"
              fullWidth
              value={openApiUrl}
              onChange={handleUpdateUrl}
              InputProps={{
                disableUnderline: false,
              }}
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

      {/* OAuth2 Client Section */}
      <Box className="apiKey">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid size={{ xs: 12 }}>
            <Typography color="black" variant="subtitle1" fontWeight="bold" mb={0.5}>
              {t("developerAPIs.oauth2ClientTitle")}
            </Typography>
          </Grid>

          {/* If no client, show create form */}
          {!oauth2Client ? (
            <>
              <Grid size={{ xs: 12, sm: 8, md: 8, lg: 9 }}>
                <TextField
                  placeholder={t("developerAPIs.oauth2ClientNamePlaceholder")}
                  variant="standard"
                  size="small"
                  fullWidth
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  InputProps={{ disableUnderline: false }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCreateClient}
                  disabled={isCreating || !clientName.trim()}
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    marginRight: { xs: 0, sm: '20px' },
                    cursor: (isCreating || !clientName.trim()) ? "not-allowed" : "pointer",
                    color: (isCreating || !clientName.trim()) ? "#6D7676" : "black",
                    height: '40px',
                    border: "1px solid #DFDFDF",
                    borderRadius: "0px",
                    "&:hover": { backgroundColor: "black", color: "white" },
                  }}
                >
                  {isCreating ? <CircularProgress size={20} /> : t("developerAPIs.createOAuth2Client")}
                </Button>
              </Grid>
            </>
          ) : (
            <>
              {/* Client Name */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Typography color="black" variant="subtitle1" fontWeight="bold" mb={0.5}>
                  {t("developerAPIs.clientNameLabel")}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 11 }}>
                <Typography color="grey" variant="body1" className="description">
                  {showClientName ? oauth2Client.name : "************************************************************************************************************************************************************************************"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 1 }}>
                <Box className="actionBtnContainer pointer d-flex-evenly" sx={{ cursor: "pointer" }}>
                  {showClientName ? (
                    <EyeIcon onClick={() => setShowClientName(false)} size={24} />
                  ) : (
                    <EyeSlashIcon onClick={() => setShowClientName(true)} size={24} />
                  )}
                  <CopyIcon size={24} onClick={() => handleCopyValue(oauth2Client.name)} />
                </Box>
              </Grid>

              {/* Client ID */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Typography color="black" variant="subtitle1" fontWeight="bold" mb={0.5}>
                  {t("developerAPIs.clientIdLabel")}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 11 }}>
                <Typography color="grey" variant="body1" className="description">
                  {showClientId ? oauth2Client.client_id : "************************************************************************************************************************************************************************************"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 1 }}>
                <Box className="actionBtnContainer pointer d-flex-evenly" sx={{ cursor: "pointer" }}>
                  {showClientId ? (
                    <EyeIcon onClick={() => setShowClientId(false)} size={24} />
                  ) : (
                    <EyeSlashIcon onClick={() => setShowClientId(true)} size={24} />
                  )}
                  <CopyIcon size={24} onClick={() => handleCopyValue(oauth2Client.client_id)} />
                </Box>
              </Grid>

              {/* Client Secret */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Typography color="black" variant="subtitle1" fontWeight="bold" mb={0.5}>
                  {t("developerAPIs.clientSecretLabel")}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 11 }}>
                <Typography color="grey" variant="body1" className="description">
                  {showClientSecret ? oauth2Client.client_secret : "************************************************************************************************************************************************************************************"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 1 }}>
                <Box className="actionBtnContainer pointer d-flex-evenly" sx={{ cursor: "pointer" }}>
                  {showClientSecret ? (
                    <EyeIcon onClick={() => setShowClientSecret(false)} size={24} />
                  ) : (
                    <EyeSlashIcon onClick={() => setShowClientSecret(true)} size={24} />
                  )}
                  <CopyIcon size={24} onClick={() => handleCopyValue(oauth2Client.client_secret)} />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Organisation Wallet Section */}
      <Box className="apiKey">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid size={{ xs: 12 }}>
            <Typography color="black" variant="subtitle1" fontWeight="bold" mb={0.5}>
              {t("developerAPIs.organisationWalletTitle")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography color="grey" variant="body1" className="description">
              {t("developerAPIs.owsBaseUrlLabel")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder={t("developerAPIs.owsBaseUrlPlaceholder")}
              variant="standard"
              size="small"
              fullWidth
              value={owsBaseUrl}
              onChange={handleOwsChange}
              InputProps={{ disableUnderline: false }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="outlined"
              onClick={handleSaveOws}
              disabled={!isOwsDirty || isSavingOws}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                cursor: (!isOwsDirty || isSavingOws) ? 'not-allowed' : 'pointer',
                color: (!isOwsDirty || isSavingOws) ? '#6D7676' : 'black',
                height: '40px',
                border: '1px solid #DFDFDF',
                borderRadius: '0px',
                '&:hover': { backgroundColor: 'black', color: 'white' },
              }}
            >
              {isSavingOws ? <CircularProgress size={20} /> : t("developerAPIs.saveButton")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
