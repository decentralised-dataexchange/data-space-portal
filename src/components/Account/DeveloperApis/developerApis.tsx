"use client"
import { Box, Button, CircularProgress, Grid, TextField, Typography, Tooltip, Avatar, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import "../style.scss";
import { useGetAdminDetails, useGetOrganizationDetails, useGetOAuth2Clients, useCreateOAuth2Client, useUpdateOrganisation, useUpdateWalletConfig, useUpdateOAuth2Client, useGetSoftwareStatement, useDeleteSoftwareStatement, useGetOrganisationOAuth2ClientsExternal, useCreateOrganisationOAuth2ClientExternal, useUpdateOrganisationOAuth2ClientExternal, useDeleteOrganisationOAuth2ClientExternal, useSoftwareStatementRequestRefocus } from "@/custom-hooks/developerApis";
import { SoftwareStatementRecord } from "@/types/softwareStatement";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { setMessage, setOAuth2Client, setSuccessMessage } from "@/store/reducers/authReducer";
import { baseURL } from "@/constants/url";
import RightSidebar from "@/components/common/RightSidebar";
import CopyButton from "@/components/common/CopyButton";
import { AttributeRow } from "@/components/common/AttributeTable";
import PasswordConfirmDialog from "@/components/common/PasswordConfirmDialog";
import SoftwareStatementModal from "@/components/Account/DeveloperApis/SoftwareStatementModal";
import DeleteSoftwareStatementModal from "@/components/Account/DeveloperApis/DeleteSoftwareStatementModal";
// Import styles used for view/add credential link-like buttons
import "@/components/OrganisationDetails/style.scss";
import { useGetOrgIdentity, useGetCoverImage, useGetLogoImage } from "@/custom-hooks/gettingStarted";
import InfoTooltipIconQuestionMark from "@/components/common/InfoTooltipIconQuestionMark";
import { sanitizeHref } from "@/utils/urlSanitizer";

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
  const [clientDescription, setClientDescription] = useState("");
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [verificationRequestURLPrefix, setVerificationRequestURLPrefix] = useState("");
  // Right sidebar modals
  const [openWalletConfig, setOpenWalletConfig] = useState(false);
  const [openOAuthConfig, setOpenOAuthConfig] = useState(false);
  const [openSoftwareStatementView, setOpenSoftwareStatementView] = useState(false);
  const [openDeleteSSModal, setOpenDeleteSSModal] = useState(false);
  const [ssShowValues, setSsShowValues] = useState(false);
  // Organisation OAuth2 External Client states
  const [openOrgOAuthConfig, setOpenOrgOAuthConfig] = useState(false);
  const [orgClientName, setOrgClientName] = useState("");
  const [orgClientId, setOrgClientId] = useState("");
  const [orgClientSecret, setOrgClientSecret] = useState("");
  const [orgClientDescription, setOrgClientDescription] = useState("");
  // Edit form states inside sidebars
  const [editOpenApiUrl, setEditOpenApiUrl] = useState("");
  const [editHolderBaseUrl, setEditHolderBaseUrl] = useState("");
  const [editCredentialOfferEndpoint, setEditCredentialOfferEndpoint] = useState("");
  const [editAccessPointEndpoint, setEditAccessPointEndpoint] = useState("");
  // Password confirmation dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'walletConfig' | 'orgOAuth2Create' | 'orgOAuth2Update' | 'orgOAuth2Delete' | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { data: oauth2List, isLoading: oauth2Loading } = useGetOAuth2Clients();
  const { mutate: createOAuth2Client, isPending: isCreating } = useCreateOAuth2Client();
  const { mutate: updateOAuth2Client, isPending: isUpdating } = useUpdateOAuth2Client();
  // Organisation OAuth2 External hooks
  const { data: orgOAuthList, isLoading: orgOAuthLoading } = useGetOrganisationOAuth2ClientsExternal();
  const { mutate: createOrgOAuth2Client, isPending: isCreatingOrgOAuth } = useCreateOrganisationOAuth2ClientExternal();
  const { mutate: updateOrgOAuth2Client, isPending: isUpdatingOrgOAuth } = useUpdateOrganisationOAuth2ClientExternal();
  const { mutate: deleteOrgOAuth2Client, isPending: isDeletingOrgOAuth } = useDeleteOrganisationOAuth2ClientExternal();
  const oauth2Client = useAppSelector((state) => state.auth.oauth2Client);

  // Fetch admin details using React Query
  const { data: adminData, isLoading: adminLoading, isError: adminError } = useGetAdminDetails();
  const userId = adminData?.id || "";

  // Fetch organization details using React Query
  const { data: orgData, isLoading: orgLoading, isError: orgError } = useGetOrganizationDetails();
  const orgDetails = (orgData?.organisation ?? orgData?.dataSource);

  // Organisation update mutation
  const { mutate: updateOrganisation, isPending: isSavingOws } = useUpdateOrganisation();
  // Wallet config mutation (password-protected)
  const { mutate: updateWalletConfig, isPending: isSavingWalletConfig } = useUpdateWalletConfig();
  // Software Statement hooks
  const { data: softwareStatementRes, isLoading: ssLoading, isError: ssError } = useGetSoftwareStatement();
  const { requestCredential, isRequesting: isRequestingSS } = useSoftwareStatementRequestRefocus({ orgId: orgDetails?.id });
  const { mutate: deleteSoftwareStatement, isPending: isDeletingSS } = useDeleteSoftwareStatement();
  const { data: coverImageBase64 } = useGetCoverImage();
  const { data: logoImageBase64 } = useGetLogoImage();

  // Derived title from VCT, matching ViewCredentials behavior
  const ssRecord = softwareStatementRes?.softwareStatement as SoftwareStatementRecord | undefined;
  const hasCredential = Boolean(ssRecord && ssRecord.credential);
  const vctRaw = ssRecord?.credential?.vct;
  const orgIdentity = useGetOrgIdentity(orgData?.id);
  // Safely extract claims and read logo/cover urls when present
  const claims = ssRecord?.credential?.claims as ({ client_uri?: string; logo_url?: string; cover_url?: string } | undefined);
  const ssLogoUrl = claims?.logo_url ?? '';
  const ssCoverUrl = claims?.cover_url ?? '';
  const vctTitle = useMemo(() => {
    const vct = vctRaw;
    if (!vct) return t('developerAPIs.softwareStatementTitle');
    return vct
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim();
  }, [vctRaw, t]);

  // Organisation display values for the Software Statement modal
  const orgName = (orgDetails as any)?.organisation?.name ?? (orgDetails as any)?.name ?? '';
  const orgDesc = (orgDetails as any)?.organisation?.description ?? (orgDetails as any)?.description ?? '';
  const orgVerified = Boolean((orgIdentity as any)?.data?.verified ?? (orgIdentity as any)?.data?.organisationalIdentity?.verified);

  // Build rows for the Software Statement: show all specified fields in order
  const ssRows = useMemo<AttributeRow[]>(() => {
    const clientUri = (claims as any)?.client_uri as string | undefined;
    const coverUrl = (claims as any)?.cover_url as string | undefined;
    const industrySector = (claims as any)?.industry_sector as string | undefined;
    const locationVal = (claims as any)?.location as string | undefined;
    const logoUrl = (claims as any)?.logo_url as string | undefined;
    const nameVal = (claims as any)?.name as string | undefined;
    const rows: AttributeRow[] = [
      { label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: false },
      { label: t('developerAPIs.softwareStatementCoverUrlLabel'), value: coverUrl || '', href: coverUrl || undefined, copy: false },
      { label: t('developerAPIs.softwareStatementIndustrySectorLabel'), value: industrySector || '', copy: false },
      { label: t('developerAPIs.softwareStatementLocationLabel'), value: locationVal || '', copy: false },
      { label: t('developerAPIs.softwareStatementLogoUrlLabel'), value: logoUrl || '', href: logoUrl || undefined, copy: false },
      { label: t('developerAPIs.softwareStatementNameLabel'), value: nameVal || '', copy: false },
    ];
    return rows;
  }, [claims, t]);

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

  // Organisation OAuth2 External - first client
  const orgOAuthClient = orgOAuthList?.organisationOAuth2Client?.[0];
  useEffect(() => {
    if (orgOAuthClient) {
      setOrgClientName(orgOAuthClient.name || "");
      setOrgClientId(orgOAuthClient.client_id || "");
      setOrgClientSecret(orgOAuthClient.client_secret || "");
      setOrgClientDescription(orgOAuthClient.description || "");
    } else {
      setOrgClientName("");
      setOrgClientId("");
      setOrgClientSecret("");
      setOrgClientDescription("");
    }
  }, [orgOAuthClient]);

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
  const openOrgOAuthSidebar = () => { setOpenOrgOAuthConfig(true); };
  const closeOrgOAuthSidebar = () => setOpenOrgOAuthConfig(false);
  const openSoftwareStatementSidebar = () => setOpenSoftwareStatementView(true);
  const closeSoftwareStatementSidebar = () => setOpenSoftwareStatementView(false);

  // Delete Software Statement -> refetch happens via hook; then close modal
  const handleDeleteSoftwareStatement = () => {
    deleteSoftwareStatement(undefined, {
      onSuccess: () => {
        closeSoftwareStatementSidebar();
        setOpenDeleteSSModal(false);
      },
      onError: () => {
        dispatch(setMessage(t('error.generic')));
      }
    });
  };


  // Save wallet config: validate fields then open password dialog
  const handleSaveWalletConfig = () => {
    if (!orgDetails?.id) return;
    if (!editHolderBaseUrl.trim()) {
      dispatch(setMessage(t('developerAPIs.owsBaseUrlRequired')));
      return;
    }
    if (!editCredentialOfferEndpoint.trim()) {
      dispatch(setMessage(t('developerAPIs.credentialOfferEndpointRequired')));
      return;
    }
    if (!editAccessPointEndpoint.trim()) {
      dispatch(setMessage(t('developerAPIs.accessPointEndpointRequired')));
      return;
    }
    setPendingAction('walletConfig');
    setPasswordError(null);
    setPasswordDialogOpen(true);
  };

  // Open password dialog for org OAuth2 external operations
  const openPasswordDialog = (action: 'orgOAuth2Create' | 'orgOAuth2Update' | 'orgOAuth2Delete') => {
    setPendingAction(action);
    setPasswordError(null);
    setPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setPendingAction(null);
    setPasswordError(null);
  };

  // Helper to detect password-related errors from API response
  const isPasswordError = (err: any): string | null => {
    const detail = err?.response?.data?.detail;
    if (typeof detail === 'string' && detail) return detail;
    const password = err?.response?.data?.password;
    if (Array.isArray(password) && password.length > 0) return password[0];
    if (typeof password === 'string' && password) return password;
    return null;
  };

  // Centralized password confirm handler
  const handlePasswordConfirm = (password: string) => {
    if (!pendingAction) return;

    if (pendingAction === 'walletConfig') {
      updateWalletConfig(
        {
          password,
          verificationRequestURLPrefix: editHolderBaseUrl.trim(),
          credentialOfferEndpoint: editCredentialOfferEndpoint.trim(),
          accessPointEndpoint: editAccessPointEndpoint.trim(),
        },
        {
          onSuccess: () => {
            setVerificationRequestURLPrefix(editHolderBaseUrl);
            closePasswordDialog();
            setOpenWalletConfig(false);
          },
          onError: (err: any) => {
            const pwErr = isPasswordError(err);
            if (pwErr) {
              setPasswordError(pwErr);
            } else {
              closePasswordDialog();
              dispatch(setMessage(t("developerAPIs.owsBaseUrlUpdateFailed")));
            }
          },
        }
      );
    } else if (pendingAction === 'orgOAuth2Create') {
      createOrgOAuth2Client(
        {
          name: orgClientName.trim(),
          client_id: orgClientId.trim(),
          client_secret: orgClientSecret.trim(),
          description: orgClientDescription.trim() || undefined,
          password,
        },
        {
          onSuccess: () => {
            closePasswordDialog();
            setOpenOrgOAuthConfig(false);
          },
          onError: (err: any) => {
            const pwErr = isPasswordError(err);
            if (pwErr) {
              setPasswordError(pwErr);
            } else {
              closePasswordDialog();
              dispatch(setMessage(t('error.generic')));
            }
          },
        }
      );
    } else if (pendingAction === 'orgOAuth2Update') {
      if (!orgOAuthClient) return;
      updateOrgOAuth2Client(
        {
          clientId: orgOAuthClient.id,
          name: orgClientName.trim(),
          client_id: orgClientId.trim(),
          client_secret: orgClientSecret.trim(),
          description: orgClientDescription.trim() || undefined,
          password,
        },
        {
          onSuccess: () => {
            closePasswordDialog();
            setOpenOrgOAuthConfig(false);
          },
          onError: (err: any) => {
            const pwErr = isPasswordError(err);
            if (pwErr) {
              setPasswordError(pwErr);
            } else {
              closePasswordDialog();
              dispatch(setMessage(t('error.generic')));
            }
          },
        }
      );
    } else if (pendingAction === 'orgOAuth2Delete') {
      const id = orgOAuthClient?.id;
      if (!id) return;
      deleteOrgOAuth2Client(
        { clientId: id, password },
        {
          onSuccess: () => {
            closePasswordDialog();
            setOpenOrgOAuthConfig(false);
          },
          onError: (err: any) => {
            const pwErr = isPasswordError(err);
            if (pwErr) {
              setPasswordError(pwErr);
            } else {
              closePasswordDialog();
              dispatch(setMessage(t('error.generic')));
            }
          },
        }
      );
    }
  };

  // Reusable row component for consistent layout/styling
  const InfoRow: React.FC<{
    label: string;
    value?: string | null;
    href?: string;
    copyKey?: string;
    copyValue?: string;
    mask?: boolean;
    tooltipMessage?: React.ReactNode;
  }> = ({ label, value, href, copyKey, copyValue, mask, tooltipMessage }) => {
    const hasValue = Boolean(value);
    const displayValue = mask && hasValue ? '••••••••••••••••' : (value || '');
    const safeHref = sanitizeHref(href);
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Typography color="black" variant="body2">{label}:</Typography>
          {!!tooltipMessage && (
            <InfoTooltipIconQuestionMark message={tooltipMessage} />
          )}
        </Box>
        <Box display="inline-flex" alignItems="center" gap={0.75}>
          {hasValue ? (
            safeHref ? (
              <a href={safeHref} target="_blank" rel="noreferrer" style={{ color: '#0000FF', wordBreak: 'break-all', fontSize: "14px" }}>{displayValue}</a>
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
  if (adminLoading || orgLoading || oauth2Loading || orgOAuthLoading) {
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
                {t("developerAPIs.organisationID")}
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
            label={t('developerAPIs.holderBaseUrlLabel')}
            value={verificationRequestURLPrefix || ''}
            href={verificationRequestURLPrefix || undefined}
            copyKey="holderBaseUrl"
            copyValue={verificationRequestURLPrefix || ''}
            tooltipMessage={t('developerAPIs.tooltips.holderBaseUrl')}
          />
          <InfoRow
            label={t('developerAPIs.credentialOfferEndpointLabel')}
            value={(orgDetails as any)?.credentialOfferEndpoint || ''}
            href={(orgDetails as any)?.credentialOfferEndpoint || undefined}
            copyKey="credentialOfferEndpoint"
            copyValue={(orgDetails as any)?.credentialOfferEndpoint || ''}
            tooltipMessage={t('developerAPIs.tooltips.credentialOfferEndpoint')}
          />
          <InfoRow
            label={t('developerAPIs.accessPointEndpointLabel')}
            value={(orgDetails as any)?.accessPointEndpoint || ''}
            href={(orgDetails as any)?.accessPointEndpoint || undefined}
            copyKey="accessPointEndpoint"
            copyValue={(orgDetails as any)?.accessPointEndpoint || ''}
            tooltipMessage={t('developerAPIs.tooltips.accessPointEndpoint')}
          />
          {/* Software Statement inside Wallet Configuration */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
              <Typography color="black" variant="body2">{t('developerAPIs.softwareStatementLabel')}:</Typography>
              <InfoTooltipIconQuestionMark message={t('developerAPIs.tooltips.softwareStatement')} />
            </Box>
            <Box display="inline-flex" alignItems="center" gap={1}>
              {(() => {
                const org = orgDetails as any;
                const hasEndpoints = !!(org?.credentialOfferEndpoint) && !!(org?.accessPointEndpoint);
                const status = softwareStatementRes?.status || '';
                const isEmpty = !softwareStatementRes || !softwareStatementRes.softwareStatement || Object.keys(softwareStatementRes.softwareStatement).length === 0;
                const available = !isEmpty && status === 'credential_accepted';
                if (available) {
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
                // Not accepted yet (empty or intermediate): show Add Credential; allow clicking even if status in-progress.
                return (
                  <Tooltip
                    title={t(hasEndpoints ? 'developerAPIs.softwareStatementRequestTooltip' : 'developerAPIs.softwareStatementPrereqMissing')}
                    arrow
                  >
                    <span style={{ cursor: (!hasEndpoints || isRequestingSS) ? 'not-allowed' : 'pointer' }}>
                      <Button
                        variant="text"
                        className={(hasEndpoints && !isRequestingSS) ? 'add-credential' : 'view-credential'}
                        disabled={!hasEndpoints || isRequestingSS}
                        onClick={() => {
                          if (!hasEndpoints || isRequestingSS) return;
                          (async () => {
                            try {
                              await requestCredential();
                              // Show success toast instructing user to accept the statement in DISP portal
                              dispatch(setSuccessMessage(t('developerAPIs.acceptSoftwareStatementToast')));
                            } catch {
                              dispatch(setMessage(t('error.generic')));
                            }
                          })();
                        }}
                        sx={{
                          p: 0,
                          minWidth: 'auto',
                          textTransform: 'none !important',
                          '&:hover': { backgroundColor: 'transparent' },
                          '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed' }
                        }}
                      >
                        {isRequestingSS ? <CircularProgress size={16} /> : t('developerAPIs.requestCredential')}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })()}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* OAuth2 Client display - Data Marketplace */}
      <Box className="apiKey" sx={{ padding: '15px 30px' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
          sx={{ mb: 1, pb: 1, borderBottom: '1px solid #E0E0E0' }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Typography color="black" variant="subtitle1" fontWeight="bold">
              {t('developerAPIs.dataSpaceOauth2Title')}
            </Typography>
            <InfoTooltipIconQuestionMark message={t('developerAPIs.tooltips.dataSpaceOauth2Title')} />
          </Box>
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

      {/* Organisation OAuth2 External Client display */}
      <Box className="apiKey" sx={{ padding: '15px 30px' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 0 }}
          sx={{ mb: 1, pb: 1, borderBottom: '1px solid #E0E0E0' }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Typography color="black" variant="subtitle1" fontWeight="bold">
              {t('developerAPIs.orgOauth2Title')}
            </Typography>
            <InfoTooltipIconQuestionMark message={t('developerAPIs.tooltips.orgOauth2Title')} />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {orgOAuthClient && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => openPasswordDialog('orgOAuth2Delete')}
                disabled={isDeletingOrgOAuth}
                sx={{
                  padding: '5px 30px',
                  border: '1px solid #DFDFDF',
                  borderRadius: 0,
                  color: 'black',
                  '&:hover': { backgroundColor: 'black', color: 'white' },
                }}
              >
                {t('common.delete')}
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={openOrgOAuthSidebar}
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
            value={orgOAuthClient?.name || ''}
            copyKey="orgClientName"
            copyValue={orgOAuthClient?.name || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientDescriptionLabel')}
            value={orgOAuthClient?.description || ''}
            copyKey="orgClientDescription"
            copyValue={orgOAuthClient?.description || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientIdLabel')}
            value={orgOAuthClient?.client_id || ''}
            copyKey="orgClientId"
            copyValue={orgOAuthClient?.client_id || ''}
          />
          <InfoRow
            label={t('developerAPIs.clientSecretLabel')}
            value={orgOAuthClient?.client_secret || ''}
            mask={!!orgOAuthClient?.client_secret}
            copyKey="orgClientSecret"
            copyValue={orgOAuthClient?.client_secret || ''}
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

      {/* RightSidebar for Organisation OAuth2 External Client */}
      <RightSidebar
        open={openOrgOAuthConfig}
        onClose={closeOrgOAuthSidebar}
        width={580}
        maxWidth={580}
        height="100%"
        footerProps={{ sx: { justifyContent: 'space-between', alignItems: 'center', gap: 1.5 } }}
        headerContent={(
          <Box sx={{ width: '100%' }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {t('developerAPIs.orgOauth2ClientConfigTitle')}
            </Typography>
          </Box>
        )}
        showBanner={false}
        showFooter={true}
        footerContent={(
          <>
            <Box>
              <Button className="delete-btn" variant="outlined" onClick={closeOrgOAuthSidebar} sx={{ minWidth: 120 }}>
                {t('common.close')}
              </Button>
            </Box>
            <Box>
              {!orgOAuthClient && (
                <Button
                  className="delete-btn"
                  variant="outlined"
                  onClick={() => {
                    // Validation: all fields mandatory
                    if (!orgClientName.trim()) { dispatch(setMessage(t('developerAPIs.orgClientNameRequired'))); return; }
                    if (!orgClientId.trim()) { dispatch(setMessage(t('developerAPIs.orgClientIdRequired'))); return; }
                    if (!orgClientSecret.trim()) { dispatch(setMessage(t('developerAPIs.orgClientSecretRequired'))); return; }
                    openPasswordDialog('orgOAuth2Create');
                  }}
                  disabled={isCreatingOrgOAuth || !orgClientName.trim() || !orgClientId.trim() || !orgClientSecret.trim()}
                  sx={{ minWidth: 120 }}
                >
                  {isCreatingOrgOAuth ? <CircularProgress size={20} /> : t('developerAPIs.createOrganisationOAuth2Client')}
                </Button>
              )}
              {orgOAuthClient && (
                <Button
                  className="delete-btn"
                  variant="outlined"
                  onClick={() => {
                    const isDirty = (
                      (orgClientName ?? '') !== (orgOAuthClient?.name ?? '') ||
                      (orgClientId ?? '') !== (orgOAuthClient?.client_id ?? '') ||
                      (orgClientSecret ?? '') !== (orgOAuthClient?.client_secret ?? '') ||
                      (orgClientDescription ?? '') !== (orgOAuthClient?.description ?? '')
                    );
                    if (!isDirty) return;
                    // Required validations
                    if (!orgClientName.trim()) { dispatch(setMessage(t('developerAPIs.orgClientNameRequired'))); return; }
                    if (!orgClientId.trim()) { dispatch(setMessage(t('developerAPIs.orgClientIdRequired'))); return; }
                    if (!orgClientSecret.trim()) { dispatch(setMessage(t('developerAPIs.orgClientSecretRequired'))); return; }
                    openPasswordDialog('orgOAuth2Update');
                  }}
                  disabled={isUpdatingOrgOAuth || !orgClientName.trim() || !orgClientId.trim() || !orgClientSecret.trim()}
                  sx={{
                    minWidth: 120,
                    '&.Mui-disabled': {
                      opacity: 0.5,
                      color: '#9e9e9e !important',
                      borderColor: '#e0e0e0 !important',
                      pointerEvents: 'auto !important',
                      cursor: 'not-allowed !important',
                    }
                  }}
                >
                  {isUpdatingOrgOAuth ? <CircularProgress size={20} /> : t('common.save')}
                </Button>
              )}
            </Box>
          </>
        )}
      >
        <Box>
          <Typography variant="body2" mb={0.5}>
            {t('developerAPIs.orgOauth2ClientNameLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.orgOauth2ClientNamePlaceholder')}
            autoFocus
            variant="standard"
            size="small"
            fullWidth
            value={orgClientName}
            onChange={(e) => setOrgClientName(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.orgOauth2ClientDescriptionLabel')}
          </Typography>
          <TextField
            placeholder={t('developerAPIs.orgOauth2ClientDescriptionPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={orgClientDescription}
            onChange={(e) => setOrgClientDescription(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.orgOauth2ClientIdLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.orgOauth2ClientIdPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={orgClientId}
            onChange={(e) => setOrgClientId(e.target.value)}
            InputProps={{ disableUnderline: false }}
            sx={{ '& .MuiInputBase-input': { color: 'black' } }}
          />

          <Typography variant="body2" mt={0.5} mb={0.5}>
            {t('developerAPIs.orgOauth2ClientSecretLabel')}<RequiredAsterisk />
          </Typography>
          <TextField
            placeholder={t('developerAPIs.orgOauth2ClientSecretPlaceholder')}
            variant="standard"
            size="small"
            fullWidth
            value={orgClientSecret}
            onChange={(e) => setOrgClientSecret(e.target.value)}
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
          ...(typeof ssRecord?.createdAt === 'number' ? [{ label: '', value: ssRecord.createdAt as number, key: '__issued' } as any] : []),
          ...(typeof ssRecord?.updatedAt === 'number' ? [{ label: '', value: ssRecord.updatedAt as number, key: '__expiry' } as any] : []),
        ]}
        showValues={ssShowValues}
        setShowValues={setSsShowValues}
        enableToggle={true}
        organisationName={orgName}
        overview={orgDesc}
        trusted={orgVerified}
        isDeleteEnabled={!isDeletingSS}
        onDelete={() => setOpenDeleteSSModal(true)}
        coverImageBase64={ssCoverUrl || coverImageBase64 || ''}
        logoImageBase64={ssLogoUrl || logoImageBase64 || ''}
      />

      <DeleteSoftwareStatementModal
        open={openDeleteSSModal}
        setOpen={setOpenDeleteSSModal}
        onConfirm={handleDeleteSoftwareStatement}
        isPending={isDeletingSS}
      />

      <PasswordConfirmDialog
        open={passwordDialogOpen}
        onClose={closePasswordDialog}
        onConfirm={handlePasswordConfirm}
        isPending={isSavingWalletConfig || isCreatingOrgOAuth || isUpdatingOrgOAuth || isDeletingOrgOAuth}
        error={passwordError}
        title={pendingAction === 'orgOAuth2Delete' ? t('developerAPIs.orgOauth2DeleteModal.title') : undefined}
        description={pendingAction === 'orgOAuth2Delete' ? t('developerAPIs.orgOauth2DeletePasswordDescription') : undefined}
      />

    </Container>
  );
};
function RequiredAsterisk() {
  return <span style={{ color: '#FF0000', marginLeft: 1, fontSize: '16px' }}>*</span>;
}
