"use client"
import { CopyIcon } from "@phosphor-icons/react";
import { Box, Button, CircularProgress, Grid, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import "../style.scss";
import { useGetAdminDetails, useGetOrganizationDetails, useGetApiToken, useGetOAuth2Clients, useCreateOAuth2Client, useUpdateOrganisation } from "@/custom-hooks/developerApis";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { setMessage, setOAuth2Client } from "@/store/reducers/authReducer";
import { baseURL } from "@/constants/url";
import RightSidebar from "@/components/common/RightSidebar";

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

export default function DeveloperAPIs() {
  const [clientName, setClientName] = useState("");
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [verificationRequestURLPrefix, setVerificationRequestURLPrefix] = useState("");
  // Right sidebar modals
  const [openWalletConfig, setOpenWalletConfig] = useState(false);
  const [openOAuthConfig, setOpenOAuthConfig] = useState(false);
  // Edit form states inside sidebars
  const [editOpenApiUrl, setEditOpenApiUrl] = useState("");
  const [editHolderBaseUrl, setEditHolderBaseUrl] = useState("");
  // Copied tooltip state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { data: oauth2List, isLoading: oauth2Loading } = useGetOAuth2Clients();
  const { mutate: createOAuth2Client, isPending: isCreating } = useCreateOAuth2Client();
  const oauth2Client = useAppSelector((state) => state.auth.oauth2Client);

  // Fetch admin details using React Query
  const { data: adminData, isLoading: adminLoading, isError: adminError } = useGetAdminDetails();
  const userId = adminData?.id || "";

  // Fetch organization details using React Query
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useGetOrganizationDetails();
  const orgDetails = (orgData?.organisation ?? orgData?.dataSource);

  // Organisation update mutation
  const { mutate: updateOrganisation, isPending: isSavingOws } = useUpdateOrganisation();

  // Set the OpenAPI URL when organization data is loaded
  useEffect(() => {
    if (orgDetails?.openApiUrl) {
      setOpenApiUrl(orgDetails.openApiUrl);
    }
    if (orgDetails?.verificationRequestURLPrefix) {
      setVerificationRequestURLPrefix(orgDetails.verificationRequestURLPrefix);
    }
  }, [orgDetails]);

  // Store first OAuth2 client in Redux when fetched
  useEffect(() => {
    const first = oauth2List?.oAuth2Clients?.[0];
    if (first) {
      dispatch(setOAuth2Client(first));
    }
  }, [oauth2List, dispatch]);

  const handleCopyValue = (value: string, key?: string) => {
    navigator.clipboard.writeText(value);
    if (key) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
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

  // Handlers to open/close sidebars
  const openWalletSidebar = () => {
    setEditOpenApiUrl(openApiUrl || "");
    setEditHolderBaseUrl(verificationRequestURLPrefix || "");
    setOpenWalletConfig(true);
  };
  const closeWalletSidebar = () => setOpenWalletConfig(false);
  const openOAuthSidebar = () => { setOpenOAuthConfig(true); };
  const closeOAuthSidebar = () => setOpenOAuthConfig(false);

  // Save both OpenAPI URL and Holder Base URL via organisation update
  const handleSaveWalletConfig = () => {
    if (!orgDetails?.id) return;
    const payload = {
      organisation: {
        ...orgDetails,
        openApiUrl: editOpenApiUrl,
        verificationRequestURLPrefix: editHolderBaseUrl,
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5, paddingTop: 1 }}>
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
            <Tooltip title={copiedKey === copyKey ? t('common.copied') : t('common.copy')}>
              <span>
                <Button onClick={() => handleCopyValue(copyValue, copyKey)} size="small" variant="text" startIcon={<CopyIcon size={16} color="#808080" />} sx={{ color: '#808080', display: 'flex', alignItems: 'center !important' }}>{t('common.copy')}</Button>
              </span>
            </Tooltip>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <InfoRow
            label={t('developerAPIs.clientNameLabel')}
            value={oauth2Client?.name || ''}
            copyKey="clientName"
            copyValue={oauth2Client?.name || ''}
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
        width={594}
        maxWidth={594}
        height="100%"
        footerProps={{ sx: { justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 } }}
        headerContent={(
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {t('developerAPIs.walletConfigurationTitle')}
            </Typography>
          </Box>
        )}
        showBanner={false}
        showFooter={true}
        footerContent={(
          <>
            <Button className="delete-btn" variant="outlined" onClick={closeWalletSidebar} sx={{ minWidth: 120 }}>
              {t('common.close')}
            </Button>
            <Button className="delete-btn" variant="outlined" onClick={handleSaveWalletConfig} sx={{ minWidth: 120 }}>
              {t('common.save')}
            </Button>
          </>
        )}
      >
        <Box>
          <Typography variant="body2" mb={0.5}>
            {t('developerAPIs.openApiUrlLabel')}<RequiredAsterisk />
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

          <Typography variant="body2" mt={2} mb={0.5}>
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
        </Box>
      </RightSidebar>

      {/* RightSidebar for OAuth2 Client */}
      <RightSidebar
        open={openOAuthConfig}
        onClose={closeOAuthSidebar}
        width={594}
        maxWidth={594}
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
          </>
        )}
      >
        <Box>
          {!oauth2Client ? (
            <>
              <Typography variant="body2" mb={0.5}>
                {t('developerAPIs.oauth2ClientNameLabel')}:
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
            </>
          ) : (
            <>
              <Typography variant="body2" mb={0.5}>
                {t('developerAPIs.clientIdLabel')}
              </Typography>
              <TextField
                variant="standard"
                size="small"
                fullWidth
                value={oauth2Client.client_id}
                InputProps={{ readOnly: true, disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
              <Typography variant="body2" mt={2} mb={0.5}>
                {t('developerAPIs.clientSecretLabel')}
              </Typography>
              <TextField
                variant="standard"
                size="small"
                fullWidth
                type="password"
                value={oauth2Client.client_secret ?? ''}
                InputProps={{ readOnly: true, disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
              <Typography variant="body2" mt={2} mb={0.5}>
                {t('developerAPIs.owsBaseUrlLabel')}
              </Typography>
              <TextField
                variant="standard"
                size="small"
                fullWidth
                value={baseURL}
                InputProps={{ readOnly: true, disableUnderline: false }}
                sx={{ '& .MuiInputBase-input': { color: 'black' } }}
              />
            </>
          )}
        </Box>
      </RightSidebar>

      
    </Container>
  );
};
function RequiredAsterisk() {
  return <span style={{ color: '#FF0000', marginLeft: 1, fontSize: '16px' }}>*</span>;
}

