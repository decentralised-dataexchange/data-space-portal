"use client"
import { Box, Button, CircularProgress, Grid, TextField, Typography, Tooltip, Avatar, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import "../style.scss";
import { useGetAdminDetails, useGetOrganizationDetails, useGetOAuth2Clients, useCreateOAuth2Client, useUpdateOrganisation, useUpdateOAuth2Client, useGetSoftwareStatement, useRequestSoftwareStatement } from "@/custom-hooks/developerApis";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { setMessage, setOAuth2Client } from "@/store/reducers/authReducer";
import { baseURL } from "@/constants/url";
import RightSidebar from "@/components/common/RightSidebar";
import CopyButton from "@/components/common/CopyButton";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import SoftwareStatementModal from "@/components/Account/DeveloperApis/SoftwareStatementModal";
// Import styles used for view/add credential link-like buttons
import "@/components/OrganisationDetails/style.scss";
import { useGetOrgIdentity } from "@/custom-hooks/gettingStarted";

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
  padding: "15px 30px",
  height: "auto",
  borderRadius: 2,
  border: "1px solid #CECECE",
}));

// Child section for Software Statement modal body
const SoftwareSectionModalContent: React.FC<{
  title: string;
  rows: AttributeRow[];
  showValues: boolean;
  status?: string;
  organisationName?: string;
  overview?: string;
}> = ({ title, rows, showValues, organisationName, overview }) => {
  const t = useTranslations();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
      {organisationName && (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" sx={{ fontSize: '16px' }}>
            {organisationName}
          </Typography>
        </Box>
      )}
      {overview && (
        <>
          <Typography variant="subtitle1" mt={2}>
            {t('common.overView')}
          </Typography>
          <Typography variant="subtitle2" color="black" mt={0.5} sx={{ wordWrap: 'break-word' }}>
            {overview}
          </Typography>
        </>
      )}
      <Typography color="grey" mt={1} variant="subtitle1">
        {title}
      </Typography>
      <AttributeTable rows={rows} showValues={showValues} labelMinWidth={200} labelMaxPercent={40} />
    </Box>
  );
};

export default function DeveloperAPIs() {
  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [verificationRequestURLPrefix, setVerificationRequestURLPrefix] = useState("");
  // Right sidebar modals
  const [openWalletConfig, setOpenWalletConfig] = useState(false);
  const [openOAuthConfig, setOpenOAuthConfig] = useState(false);
  const [openSoftwareStatementView, setOpenSoftwareStatementView] = useState(false);
  const [ssShowValues, setSsShowValues] = useState(false);
  // Edit form states inside sidebars
  const [editOpenApiUrl, setEditOpenApiUrl] = useState("");
  const [editHolderBaseUrl, setEditHolderBaseUrl] = useState("");
  const [editCredentialOfferEndpoint, setEditCredentialOfferEndpoint] = useState("");
  const [editAccessPointEndpoint, setEditAccessPointEndpoint] = useState("");
  const { data: oauth2List, isLoading: oauth2Loading } = useGetOAuth2Clients();
  const { mutate: createOAuth2Client, isPending: isCreating } = useCreateOAuth2Client();
  const { mutate: updateOAuth2Client, isPending: isUpdating } = useUpdateOAuth2Client();
  const oauth2Client = useAppSelector((state) => state.auth.oauth2Client);

  // Fetch admin details using React Query
  const { data: adminData, isLoading: adminLoading, isError: adminError } = useGetAdminDetails();
  const userId = adminData?.id || "";

  // Fetch organization details using React Query
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useGetOrganizationDetails();
  const orgDetails = (orgData?.organisation ?? orgData?.dataSource);

  // Organisation update mutation
  const { mutate: updateOrganisation, isPending: isSavingOws } = useUpdateOrganisation();
  // Software Statement hooks
  const { data: softwareStatementRes, isLoading: ssLoading, isError: ssError } = useGetSoftwareStatement();
  const { mutate: requestSoftwareStatement, isPending: isRequestingSS } = useRequestSoftwareStatement();

  // Derived title from VCT, matching ViewCredentials behavior
  const ssObj = softwareStatementRes?.softwareStatement as any | undefined;
  const vctRaw = ssObj?.credential?.vct as string | undefined;
  const orgIdentity = useGetOrgIdentity(orgData?.id);
  const vctTitle = useMemo(() => {
    const vct = vctRaw;
    if (!vct) return t('developerAPIs.softwareStatementTitle');
    return vct
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim();
  }, [vctRaw, t]);

  // Build rows for the common AttributeTable: only client_uri as per spec
  const ssRows = useMemo<AttributeRow[]>(() => {
    const clientUri = (ssObj?.credential?.claims as any)?.client_uri as string | undefined;
    const rows: AttributeRow[] = [];
    rows.push({ label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: true });
    return rows;
  }, [ssObj, t]);

  // Set the OpenAPI URL when organization data is loaded
  useEffect(() => {
    if (orgDetails?.openApiUrl) {
      setOpenApiUrl(orgDetails.openApiUrl);
    }
    if (orgDetails?.verificationRequestURLPrefix) {
      setVerificationRequestURLPrefix(orgDetails.verificationRequestURLPrefix);
    }
    // Initialize endpoint edit fields when org details load
    setEditCredentialOfferEndpoint(orgDetails?.credentialOfferEndpoint || "");
    setEditAccessPointEndpoint(orgDetails?.accessPointEndpoint || "");
  }, [orgDetails]);

  // Store first OAuth2 client in Redux when fetched
  useEffect(() => {
    const first = oauth2List?.oAuth2Clients?.[0];
    if (first) {
      dispatch(setOAuth2Client(first));
    }
  }, [oauth2List, dispatch]);

  // Initialize editable fields when an OAuth2 client exists (for displaying editable fields)
  useEffect(() => {
    if (oauth2Client) {
      setClientName(oauth2Client.name ?? "");
      setClientDescription(oauth2Client.description ?? "");
    }
  }, [oauth2Client]);

  const handleCreateClient = () => {
    // Prevent submission if a client already exists (defensive guard)
    if (oauth2Client) return;
    if (!clientName.trim()) return;
    createOAuth2Client(
      { name: clientName.trim(), description: clientDescription.trim() || undefined },
      {
        onSuccess: (res) => {
          if (res?.oAuth2Client) {
            dispatch(setOAuth2Client(res.oAuth2Client));
            setClientName("");
            setClientDescription("");
            // Auto-close the OAuth2 sidebar after successful creation
            closeOAuthSidebar();
          }
        },
        onError: () => {
          dispatch(setMessage(t("error.generic")));
        }
      }
    );
  };

  const isOAuthFormDirty = !!oauth2Client && (
    (clientName ?? "") !== (oauth2Client.name ?? "") || (clientDescription ?? "") !== (oauth2Client.description ?? "")
  );

  const handleUpdateClient = () => {
    if (!oauth2Client) return;
    // Guard against forced enable: only submit when fields are dirty
    if (!isOAuthFormDirty) return;
    // Required validation for Client Name
    if (!clientName.trim()) {
      dispatch(setMessage(t('developerAPIs.clientNameRequired')));
      return;
    }
    const payload = {
      clientId: oauth2Client.id,
      name: clientName.trim(),
      description: clientDescription.trim(),
    };
    updateOAuth2Client(payload, {
      onSuccess: (res) => {
        if (res?.oAuth2Client) {
          dispatch(setOAuth2Client(res.oAuth2Client));
          setOpenOAuthConfig(false);
        }
      },
      onError: () => {
        dispatch(setMessage(t("error.generic")));
      }
    });
  };

  // Handlers to open/close sidebars
  const openWalletSidebar = () => {
    setEditOpenApiUrl(openApiUrl || "");
    setEditHolderBaseUrl(verificationRequestURLPrefix || "");
    setEditCredentialOfferEndpoint((orgDetails as any)?.credentialOfferEndpoint || "");
    setEditAccessPointEndpoint((orgDetails as any)?.accessPointEndpoint || "");
    setOpenWalletConfig(true);
  };
  const closeWalletSidebar = () => setOpenWalletConfig(false);
  const openOAuthSidebar = () => { setOpenOAuthConfig(true); };
  const closeOAuthSidebar = () => setOpenOAuthConfig(false);
  const openSoftwareStatementSidebar = () => setOpenSoftwareStatementView(true);
  const closeSoftwareStatementSidebar = () => setOpenSoftwareStatementView(false);

  // Stub flow for delete software statement
  const handleDeleteSoftwareStatement = () => {
    // TODO: Integrate API once available (e.g., apiService.deleteSoftwareStatement())
    // Keeping disabled in UI for now. This is just a placeholder to document the flow.
    dispatch(setMessage(t('common.comingSoon')));
  };

  // Save both OpenAPI URL and Holder Base URL via organisation update
  const handleSaveWalletConfig = () => {
    if (!orgDetails?.id) return;
    // Required validation for Holder Base URL (has asterisk)
    if (!editHolderBaseUrl.trim()) {
      dispatch(setMessage(t('developerAPIs.owsBaseUrlRequired')));
      return;
    }
    // Required validation for Credential Offer Endpoint
    if (!editCredentialOfferEndpoint.trim()) {
      dispatch(setMessage(t('developerAPIs.credentialOfferEndpointRequired')));
      return;
    }
    // Required validation for Access Point Endpoint
    if (!editAccessPointEndpoint.trim()) {
      dispatch(setMessage(t('developerAPIs.accessPointEndpointRequired')));
      return;
    }
    const payload = {
      organisation: {
        ...orgDetails,
        openApiUrl: editOpenApiUrl,
        verificationRequestURLPrefix: editHolderBaseUrl,
        credentialOfferEndpoint: editCredentialOfferEndpoint?.trim() ? editCredentialOfferEndpoint.trim() : null,
        accessPointEndpoint: editAccessPointEndpoint?.trim() ? editAccessPointEndpoint.trim() : null,
      },
    } as unknown as { organisation: any };
    updateOrganisation(payload as any, {
      onSuccess: () => {
        setOpenApiUrl(editOpenApiUrl);
        setVerificationRequestURLPrefix(editHolderBaseUrl);
        setOpenWalletConfig(false);
      },
      onError: () => {
        dispatch(setMessage(t("developerAPIs.owsBaseUrlUpdateFailed")));
      },
    });
  };

  // Reusable row component for consistent layout/styling
  const InfoRow: React.FC<{
    label: string;
    value?: string | null;
    href?: string;
    copyKey?: string;
    copyValue?: string;
    mask?: boolean;
  }> = ({ label, value, href, copyKey, copyValue, mask }) => {
    const hasValue = Boolean(value);
    const displayValue = mask && hasValue ? '••••••••••••••••' : (value || '');
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
        <Typography color="black" variant="body2">{label}:</Typography>
        <Box display="inline-flex" alignItems="center" gap={0.75}>
          {hasValue ? (
            href ? (
              <a href={href} target="_blank" rel="noreferrer" style={{ color: '#0000FF', wordBreak: 'break-all', fontSize: "14px" }}>{displayValue}</a>
            ) : (
              <Typography color="black" variant="body2" sx={{ wordBreak: 'break-all' }}>{displayValue}</Typography>
            )
          ) : (
            <Typography color="grey" variant="body2">-</Typography>
          )}
          {!!copyValue && (
            <CopyButton text={copyValue} />
          )}
        </Box>
      </Box>
    );
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
      {/* Organisation Wallet Configuration (combined view) */}
      <Box className="apiKey" sx={{ padding: '15px 30px' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
          sx={{ mb: 1, pb: 1, borderBottom: '1px solid #E0E0E0' }}
        >
          <Typography color="black" variant="subtitle1" fontWeight="bold">
            {t('developerAPIs.walletConfigurationTitle')}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              onClick={openWalletSidebar}
              sx={{
                padding: '5px 50px',
                border: '1px solid #DFDFDF',
                borderRadius: 0,
                color: 'black',
                '&:hover': { backgroundColor: 'black', color: 'white' },
              }}
            >
              {t('developerAPIs.configureButton')}
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <InfoRow
            label={t('developerAPIs.openApiUrlLabel')}
            value={openApiUrl || ''}
            href={openApiUrl || undefined}
            copyKey="openApiUrl"
            copyValue={openApiUrl || ''}
          />
          <InfoRow
            label={t('developerAPIs.holderBaseUrlLabel')}
            value={verificationRequestURLPrefix || ''}
            href={verificationRequestURLPrefix || undefined}
            copyKey="holderBaseUrl"
            copyValue={verificationRequestURLPrefix || ''}
          />
          <InfoRow
            label={t('developerAPIs.credentialOfferEndpointLabel')}
            value={(orgDetails as any)?.credentialOfferEndpoint || ''}
            href={(orgDetails as any)?.credentialOfferEndpoint || undefined}
            copyKey="credentialOfferEndpoint"
            copyValue={(orgDetails as any)?.credentialOfferEndpoint || ''}
          />
          <InfoRow
            label={t('developerAPIs.accessPointEndpointLabel')}
            value={(orgDetails as any)?.accessPointEndpoint || ''}
            href={(orgDetails as any)?.accessPointEndpoint || undefined}
            copyKey="accessPointEndpoint"
            copyValue={(orgDetails as any)?.accessPointEndpoint || ''}
          />
          {/* Software Statement inside Wallet Configuration */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
            <Typography color="black" variant="body2">{t('developerAPIs.softwareStatementLabel')}:</Typography>
            <Box display="inline-flex" alignItems="center" gap={1}>
              {(() => {
                const org = orgDetails as any;
                const hasEndpoints = !!(org?.credentialOfferEndpoint) && !!(org?.accessPointEndpoint);
                const status = softwareStatementRes?.status || '';
                const isEmpty = !softwareStatementRes || !softwareStatementRes.softwareStatement || Object.keys(softwareStatementRes.softwareStatement).length === 0;
                if (isEmpty) {
                  return (
                    <>
                      <Tooltip
                        title={t(hasEndpoints ? 'developerAPIs.softwareStatementRequestTooltip' : 'developerAPIs.softwareStatementPrereqMissing')}
                        arrow
                      >
                        <span style={{ cursor: (!hasEndpoints || isRequestingSS) ? 'not-allowed' : 'pointer' }}>
                          <Button
                            variant="text"
                            className={'view-credential'}
                            disabled={!hasEndpoints || isRequestingSS}
                            onClick={() => {
                              if (!hasEndpoints) return;
                              requestSoftwareStatement(undefined, {
                                onSuccess: () => {
                                  dispatch(setMessage(t('common.success')));
                                },
                                onError: () => dispatch(setMessage(t('error.generic')))
                              });
                            }}
                            sx={{
                              p: 0,
                              minWidth: 'auto',
                              textTransform: 'none !important',
                              '&:hover': { backgroundColor: 'transparent' },
                              '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed' }
                            }}
                          >
                            {isRequestingSS ? <CircularProgress size={16} /> : t('gettingStarted.addCredential')}
                          </Button>
                        </span>
                      </Tooltip>
                    </>
                  );
                }
                if (status === 'credential_accepted') {
                  return (
                    <Tooltip title={t('developerAPIs.softwareStatementViewTooltip')} arrow>
                      <Button
                        variant="text"
                        className={'view-credential'}
                        onClick={openSoftwareStatementSidebar}
                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none !important', '&:hover': { backgroundColor: 'transparent' } }}
                      >
                        {t('gettingStarted.viewCredential')}
                      </Button>
                    </Tooltip>
                  );
                }
                // Intermediate states: show disabled Request button with informative tooltip
                return (
                  <Tooltip title={t(`developerAPIs.softwareStatementStatus.${status}` as const)} arrow>
                    <span style={{ cursor: 'not-allowed' }}>
                      <Button
                        variant="text"
                        className={'view-credential'}
                        disabled
                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none !important', '&:hover': { backgroundColor: 'transparent' }, '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed' } }}
                      >
                        {t('developerAPIs.softwareStatementRequest')}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })()}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* OAuth2 Client display */}
      <Box className="apiKey" sx={{ padding: '15px 30px' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
          sx={{ mb: 1, pb: 1, borderBottom: '1px solid #E0E0E0' }}
        >
          <Typography color="black" variant="subtitle1" fontWeight="bold">
            {t('developerAPIs.oauth2Title')}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              onClick={openOAuthSidebar}
              sx={{
                padding: '5px 50px',
                border: '1px solid #DFDFDF',
                borderRadius: 0,
                color: 'black',
                '&:hover': { backgroundColor: 'black', color: 'white' },
              }}
            >
              {t('developerAPIs.configureButton')}
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <InfoRow
            label={t('developerAPIs.clientNameLabel')}
            value={oauth2Client?.name || ''}
            copyKey="clientName"
            
            copyValue={oauth2Client?.name || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientDescriptionLabel')}
            value={oauth2Client?.description || ''}
            copyKey="clientDescription"
            copyValue={oauth2Client?.description || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientIdLabel')}
            value={oauth2Client?.client_id || ''}
            copyKey="clientId"
            copyValue={oauth2Client?.client_id || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientSecretLabel')}
            value={oauth2Client?.client_secret || ''}
            mask={!!oauth2Client?.client_secret}
            copyKey="clientSecret"
            copyValue={oauth2Client?.client_secret || ''}
          />
        </Box>
      </Box>

      {/* RightSidebar for Wallet Configuration */}
      <RightSidebar
        open={openWalletConfig}
        onClose={closeWalletSidebar}
        width={580}
        maxWidth={580}
        height="100%"
        footerProps={{ sx: { justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 } }}
        headerContent={(
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {t('developerAPIs.walletConfigurationTitle')}
            </Typography>
          </Box>
        )}
        showFooter={true}
        footerContent={(
          <>
            <Button className="delete-btn" variant="outlined" onClick={closeWalletSidebar} sx={{ minWidth: 120 }}>
              {t('common.close')}
            </Button>
            <Button
              className="delete-btn"
              variant="outlined"
              onClick={handleSaveWalletConfig}
              disabled={!editHolderBaseUrl.trim() || !editCredentialOfferEndpoint.trim() || !editAccessPointEndpoint.trim()}
              sx={{
                minWidth: 120,
                '&.Mui-disabled': {
                  opacity: 0.5,
                  color: '#9e9e9e !important',
                  borderColor: '#e0e0e0 !important',
                  // Allow cursor styling to apply on disabled button
                  pointerEvents: 'auto !important',
                  cursor: 'not-allowed !important',
                }
              }}
            >
              {t('common.save')}
            </Button>
          </>
        )}
      >
        <Box>
          <Typography variant="body2" mb={0.5}>
            {t('developerAPIs.openApiUrlLabel')}
          </Typography>
          <TextField
            placeholder={t('developerAPIs.openApiUrlPlaceholder')}
            autoFocus
            variant="standard"
            size="small"
            fullWidth
            value={editOpenApiUrl}
            onChange={(e) => setEditOpenApiUrl(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.holderBaseUrlLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.owsBaseUrlPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={editHolderBaseUrl}
            onChange={(e) => setEditHolderBaseUrl(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.credentialOfferEndpointLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.credentialOfferEndpointPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={editCredentialOfferEndpoint}
            onChange={(e) => setEditCredentialOfferEndpoint(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.accessPointEndpointLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.accessPointEndpointPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={editAccessPointEndpoint}
            onChange={(e) => setEditAccessPointEndpoint(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />
        </Box>
      </RightSidebar>

      {/* RightSidebar for OAuth2 Client */}
      <RightSidebar
        open={openOAuthConfig}
        onClose={closeOAuthSidebar}
        width={580}
        maxWidth={580}
        height="100%"
        footerProps={{ sx: { justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 } }}
        headerContent={(
          <Box sx={{ width: '100%' }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {t('developerAPIs.oauth2ClientConfigTitle')}
            </Typography>
          </Box>
        )}
        showBanner={false}
        showFooter={true}
        footerContent={(
          <>
            <Button className="delete-btn" variant="outlined" onClick={closeOAuthSidebar} sx={{ minWidth: 120 }}>
              {t('common.close')}
            </Button>
            {!oauth2Client && (
              <Button
                className="delete-btn"
                variant="outlined"
                onClick={handleCreateClient}
                disabled={isCreating || !clientName.trim()}
                sx={{ minWidth: 120 }}
              >
                {isCreating ? <CircularProgress size={20} /> : t('developerAPIs.createOAuth2Client')}
              </Button>
            )}
            {oauth2Client && (
              <Button
                className="delete-btn"
                variant="outlined"
                onClick={handleUpdateClient}
                disabled={!isOAuthFormDirty || isUpdating || !clientName.trim()}
                sx={{
                  minWidth: 120,
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    color: '#9e9e9e !important',
                    borderColor: '#e0e0e0 !important',
                    // Allow cursor styling to apply on disabled button
                    pointerEvents: 'auto !important',
                    cursor: 'not-allowed !important',
                  }
                }}
              >
                {isUpdating ? <CircularProgress size={20} /> : t('common.save')}
              </Button>
            )}
          </>
        )}
      >
        <Box>
          {!oauth2Client ? (
            <>
              <Typography variant="body2" mb={0.5}>
                {t('developerAPIs.oauth2ClientNameLabel')}<RequiredAsterisk />
              </Typography>
              <TextField
                placeholder={t('developerAPIs.oauth2ClientNamePlaceholder')}
                autoFocus
                variant="standard"
                size="small"
                fullWidth
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                InputProps={{ disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
              <Typography variant="body2" mt={0.5} mb={0.5}>
                {t('developerAPIs.oauth2ClientDescriptionLabel')}
              </Typography>
              <TextField
                placeholder={t('developerAPIs.oauth2ClientDescriptionPlaceholder')}
                variant="standard"
                size="small"
                fullWidth
                value={clientDescription}
                onChange={(e) => setClientDescription(e.target.value)}
                InputProps={{ disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
            </>
          ) : (
            <>
              <Typography variant="body2" mb={0.5}>
                {t('developerAPIs.oauth2ClientNameLabel')}<RequiredAsterisk />
              </Typography>
              <TextField
                placeholder={t('developerAPIs.oauth2ClientNamePlaceholder')}
                variant="standard"
                size="small"
                fullWidth
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                InputProps={{ disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
              <Typography variant="body2" mt={0.5} mb={0.5}>
                {t('developerAPIs.oauth2ClientDescriptionLabel')}
              </Typography>
              <TextField
                placeholder={t('developerAPIs.oauth2ClientDescriptionPlaceholder')}
                variant="standard"
                size="small"
                fullWidth
                value={clientDescription}
                onChange={(e) => setClientDescription(e.target.value)}
                InputProps={{ disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
              {/* <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <StaticInputLike
                  label={t('developerAPIs.clientIdLabel')}
                  value={oauth2Client.client_id}
                />
                <StaticInputLike
                  label={t('developerAPIs.clientSecretLabel')}
                  value={oauth2Client.client_secret}
                  mask={!!oauth2Client.client_secret}
                />
                <StaticInputLike
                  label={t('developerAPIs.owsBaseUrlLabel')}
                  value={baseURL}
                />
              </Box> */}
            </>
          )}
        </Box>
      </RightSidebar>

      {/* Software Statement Modal */}
      <SoftwareStatementModal
        open={openSoftwareStatementView}
        onClose={closeSoftwareStatementSidebar}
        title={vctTitle}
        rows={[
          ...ssRows,
          // meta rows for issued/expiry (filtered out in component)
          ...(ssObj?.createdAt ? [{ label: '', value: ssObj.createdAt as any, key: '__issued' } as any] : []),
          ...(ssObj?.updatedAt ? [{ label: '', value: ssObj.updatedAt as any, key: '__expiry' } as any] : []),
        ]}
        showValues={ssShowValues}
        setShowValues={setSsShowValues}
        statusLabel={softwareStatementRes?.status ? t(`developerAPIs.softwareStatementStatus.${softwareStatementRes.status}` as const) : undefined}
        organisationName={(orgDetails as any)?.name || ''}
        overview={(orgDetails as any)?.description || ''}
        onDelete={handleDeleteSoftwareStatement}
        isDeleteEnabled={false}
        trusted={orgIdentity?.data?.verified}
        accessPointEndpoint={(orgDetails as any)?.accessPointEndpoint || ''}
      />

      
    </Container>
  );
};
function RequiredAsterisk() {
  return <span style={{ color: '#FF0000', marginLeft: 1, fontSize: '16px' }}>*</span>;
}

