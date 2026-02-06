"use client";

import React from "react";
import { Box, Typography, Avatar, IconButton, Button, Tooltip, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import RightSidebar from "@/components/common/RightSidebar";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import ViewCredentials from "@/components/ViewCredentials";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, CaretLeft } from "@phosphor-icons/react";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";
import type { ServiceOrganisationItemOrg } from "@/types/serviceOrganisation";
import type { OrgIdentityResponse } from "@/types/orgIdentity";
import { apiService } from "@/lib/apiService/apiService";
import SoftwareStatementSection from "@/components/ViewCredentials/SoftwareStatementSection";
import CredentialCard from "@/components/ViewCredentials/CredentialCard";
import type { VpTokenRequestPayload } from "@/types/vpTokenRequest";

interface Props {
  organisation: ServiceOrganisationItemOrg;
  organisationIdentity?: any;
  // Optional override for trusted state when identity object isn't available (e.g., on home cards)
  trustedOverride?: boolean;
  extraFooterContent?: React.ReactNode;
}

type ViewMode = 'list' | 'vp_token' | 'software_statement';

const ViewCredentialsController: React.FC<Props> = ({ organisation, organisationIdentity, trustedOverride, extraFooterContent }) => {
  const t = useTranslations();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showValues, setShowValues] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('list'); // 'list' | 'vp_token' | 'software_statement'

  const [ss, setSs] = React.useState<any>(() => {
    const orgAny = organisation as any;
    const initial = orgAny?.softwareStatement || orgAny?.software_statement;
    return initial && Object.keys(initial).length > 0 ? initial : undefined;
  });
  const [publicIdentity, setPublicIdentity] = React.useState<any>(undefined);

  const trusted = React.useMemo(() => {
    if (typeof trustedOverride === 'boolean') return trustedOverride;
    return Boolean(
      organisationIdentity?.presentationRecord?.verified ||
      organisationIdentity?.isPresentationVerified
    );
  }, [organisationIdentity, trustedOverride]);

  // Decode vpTokenRequest if available
  const vpTokenMetadata = React.useMemo(() => {
    try {
      const source = publicIdentity ?? organisationIdentity;
      const vpTokenRequest = source?.presentationRecord?.vpTokenRequest;
      if (!vpTokenRequest || typeof vpTokenRequest !== 'string') return undefined;

      const parts = vpTokenRequest.split('.');
      if (parts.length < 2) return undefined;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload) as VpTokenRequestPayload;
      return payload.client_metadata;
    } catch (e) {
      console.error('Failed to decode vpTokenRequest', e);
      return undefined;
    }
  }, [organisationIdentity, publicIdentity]);

  // Minimal adapter to feed ViewCredentials using public identity data
  const orgIdentityForView = React.useMemo<OrgIdentityResponse | undefined>(() => {
    try {
      const identitySource: any = publicIdentity ?? organisationIdentity;
      const presentation = identitySource?.presentationRecord?.presentation;
      const first = Array.isArray(presentation) && presentation.length > 0 ? (presentation[0] as any) : undefined;
      
      if (!first) {
        return {
          organisationalIdentity: {} as any,
          organisationId: organisation?.id || "",
          presentationExchangeId: "",
          state: "",
          verified: trusted,
        } as OrgIdentityResponse;
      }
      return {
        organisationalIdentity: {
          presentation: [first],
          verified: trusted,
        } as any,
        organisationId: organisation?.id || "",
        presentationExchangeId: "",
        state: "",
        verified: trusted,
      } as OrgIdentityResponse;
    } catch {
      return undefined;
    }
  }, [publicIdentity, organisationIdentity, organisation?.id, trusted]);

  const badgeLabel = trusted ? t('gettingStarted.viewCredential') : 'Credential Unavailable';

  const handleBadgeClick = () => {
    if (!trusted) return; 
    setOpen(true);
    setViewMode('list'); // Reset to list view on open
  };

  const handleClose = () => {
    setOpen(false);
    setViewMode('list');
  }

  // When modal opens on public pages, fetch the latest organisation by ID to get softwareStatement and full identity if missing
  React.useEffect(() => {
    const fetchSSIfMissing = async () => {
      if (!open) return;
      try {
        const orgId = organisation?.id;
        if (!orgId) return;
        const needSS = !ss || Object.keys(ss || {}).length === 0;
        const needIdentity = !publicIdentity || !Array.isArray(publicIdentity?.presentationRecord?.presentation);
        if (needSS || needIdentity) {
          const res = await apiService.getServiceOrganisationById(orgId);
          const first = res?.organisations?.[0];
          if (needSS) {
            const orgAny = (first as any)?.organisation || {};
            const ssFromApi: any = orgAny?.softwareStatement || orgAny?.software_statement;
            if (ssFromApi && Object.keys(ssFromApi).length > 0) {
              setSs(ssFromApi);
            }
          }
          if (needIdentity) {
            const identityFromApi: any = (first as any)?.organisationIdentity;
            if (identityFromApi) setPublicIdentity(identityFromApi);
          }
        }
      } catch (e) {
        // fail silently on public page
      }
    };
    fetchSSIfMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Helper to calculate VCT Title for the card (replicating logic from ViewCredentials)
  const getVctTitle = () => {
      const presentation = orgIdentityForView?.organisationalIdentity?.presentation;
      const first = Array.isArray(presentation) && presentation.length > 0 ? (presentation[0] as any) : undefined;
      const vct = first?.vct as string | undefined;
      if (!vct) return t('common.certificateOfRegistration');
      return vct
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim();
  }

  // Derived content for Detail View (Banner, Header, Logo) based on viewMode
  const detailConfig = React.useMemo(() => {
    if (viewMode === 'vp_token') {
        return {
            title: vpTokenMetadata?.client_name || organisation?.name || t('gettingStarted.viewCredential'),
            cover: vpTokenMetadata?.cover_uri || organisation?.coverImageUrl || defaultCoverImage,
            logo: vpTokenMetadata?.logo_uri || organisation?.logoUrl || defaultLogoImg,
        }
    }
    if (viewMode === 'software_statement') {
        const claims = (ss as any)?.credential?.claims;
        return {
             // Use SS specific name or fallback
            title: claims?.name || t('developerAPIs.softwareStatementTitle'),
            cover: claims?.cover_url || organisation?.coverImageUrl || defaultCoverImage,
            logo: claims?.logo_url || organisation?.logoUrl || defaultLogoImg,
        }
    }
    // Default (List View)
    return {
        title: t('gettingStarted.viewCredential'),
        cover: organisation?.coverImageUrl || defaultCoverImage,
        logo: organisation?.logoUrl || defaultLogoImg,
    }
  }, [viewMode, vpTokenMetadata, organisation, ss, t]);


  const headerContent = viewMode === 'list' ? (
    <Box sx={{ width: '100%' }}>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
        {t('gettingStarted.viewCredential')}
      </Typography>
    </Box>
  ) : (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => setViewMode('list')} size="small" sx={{ color: '#F3F3F6', p: 0.5, mr: 1, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <CaretLeft size={20} />
        </IconButton>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
        {t('gettingStarted.viewCredential')}
      </Typography>
    </Box>
  );

  const bannerContent = (
    <Box sx={{ position: 'relative' }}>
      <Box
        component="img"
        key={detailConfig.cover}
        alt="Banner"
        src={detailConfig.cover}
        sx={{ height: 194, width: '100%', objectFit: 'cover' }}
      />
      <IconButton
        onClick={() => setShowValues(!showValues)}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 10,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }
        }}
      >
        {showValues ? <EyeSlashIcon size={20} color="white" /> : <EyeIcon size={20} color="white" />}
      </IconButton>
      <Box sx={{ position: 'relative', height: '65px', left: -25 }}>
        <Avatar
          key={detailConfig.logo}
          src={detailConfig.logo}
          sx={{ position: 'absolute', left: 50, top: -65, width: 110, height: 110, border: '6px solid white', backgroundColor: 'white' }}
        />
      </Box>
    </Box>
  );

  return (
    <>
      <Tooltip title={badgeLabel} placement="top">
        <Box
          component="button"
          type="button"
          onClick={handleBadgeClick}
          onKeyDown={(event) => {
            if (!trusted) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen(true);
              setViewMode('list');
            }
          }}
          aria-label={badgeLabel}
          aria-disabled={!trusted}
          disabled={!trusted}
          sx={{
            ml: 0.5,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: trusted ? 'pointer' : 'not-allowed',
            opacity: trusted ? 1 : 0.8,
            '&:focus-visible': {
              outline: '2px solid #03182b',
              outlineOffset: 2,
            },
            '&:disabled': {
              cursor: 'not-allowed',
            },
          }}
        >
          <VerifiedBadge trusted={trusted} />
        </Box>
      </Tooltip>

      <RightSidebar
        open={open}
        onClose={handleClose}
        width={580}
        maxWidth={580}
        keepMounted
        height="100%"
        headerContent={headerContent}
        bannerContent={bannerContent}
        showBanner
        showFooter
        footerContent={(
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <Button className="delete-btn" variant="outlined" onClick={handleClose} sx={{ minWidth: 120, textTransform: 'none' }}>
              {t('common.close')}
            </Button>
            {extraFooterContent}
          </Box>
        )}
      >
        <Box sx={{ pt: 4 }}>
          {viewMode === 'list' && (
            <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: '16px', color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {organisation?.name}
                        <VerifiedBadge trusted={trusted} />
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        {t('common.overView')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'black', wordWrap: 'break-word' }}>
                        {organisation?.description}
                    </Typography>
                </Box>
                
               {/* VP Token Card */}
              <CredentialCard  
                title={getVctTitle()}
                orgName={organisation?.name || ''} 
                issuedBy={vpTokenMetadata?.client_name}
                logoUrl={vpTokenMetadata?.logo_uri}
                onClick={() => setViewMode('vp_token')}
              />

              {/* Software Statement Card (if exists) */}
              {ss && Object.keys(ss).length > 0 && (
                  <CredentialCard 
                    title={t('developerAPIs.softwareStatementTitle')}
                    orgName={organisation?.name || ''}
                    issuedBy={organisation?.name} // Falling back to org name as issuer for SS
                    logoUrl={(ss as any)?.credential?.claims?.logo_url}
                    onClick={() => setViewMode('software_statement')}
                  />
              )}
            </Box>
          )}

          {viewMode === 'vp_token' && (
            <Box display="flex" flexDirection="column" gap={3}>
                 <Box>
                    <Typography variant="h6" sx={{ fontSize: '16px', color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {vpTokenMetadata?.client_name || organisation?.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        {t('common.overView')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'black', wordWrap: 'break-word' }}>
                        {vpTokenMetadata?.description || organisation?.description}
                    </Typography>
                 </Box>
                 <ViewCredentials
                    orgIdentity={orgIdentityForView}
                    organisation={{
                        id: organisation?.id,
                        name: organisation?.name,
                        description: organisation?.description,
                        location: organisation?.location,
                        policyUrl: organisation?.policyUrl,
                        sector: organisation?.sector,
                        logoUrl: organisation?.logoUrl,
                        coverImageUrl: organisation?.coverImageUrl,
                    } as any}
                    showValues={showValues}
                    isDetailView
                />
            </Box>
          )}

          {viewMode === 'software_statement' && (
             <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                    <Typography variant="h6" sx={{ fontSize: '16px', color: theme.palette.text.primary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {(ss as any)?.credential?.claims?.name || organisation?.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                        {t('common.overView')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 0.5, color: 'black', wordWrap: 'break-word' }}>
                        {(ss as any)?.credential?.claims?.description || organisation?.description}
                    </Typography>
                </Box>
                <SoftwareStatementSection ss={ss} showValues={showValues} isDetailView />
             </Box>
          )}

        </Box>
      </RightSidebar>
    </>
  );
};

export default ViewCredentialsController;
