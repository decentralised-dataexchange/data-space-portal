"use client";

import React from "react";
import { Box, Typography, Avatar, IconButton, Button, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import RightSidebar from "@/components/common/RightSidebar";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import ViewCredentials from "@/components/ViewCredentials";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import IssuedExpiryStrip from "@/components/common/IssuedExpiryStrip";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon } from "@phosphor-icons/react";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";
import type { ServiceOrganisationItemOrg } from "@/types/serviceOrganisation";
import type { OrgIdentityResponse } from "@/types/orgIdentity";
import { apiService } from "@/lib/apiService/apiService";

interface Props {
  organisation: ServiceOrganisationItemOrg;
  organisationIdentity?: any;
  // Optional override for trusted state when identity object isn't available (e.g., on home cards)
  trustedOverride?: boolean;
}

const ViewCredentialsController: React.FC<Props> = ({ organisation, organisationIdentity, trustedOverride }) => {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [showValues, setShowValues] = React.useState(false);
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

  // Software statement rows from local state (which may be fetched on demand)
  const { ssTitle, ssRows } = React.useMemo(() => {
    const rows: AttributeRow[] = [];
    const ssLocal: any = ss;
    if (!ssLocal || Object.keys(ssLocal).length === 0) return { ssTitle: undefined as string | undefined, ssRows: rows };
    const vct: string | undefined = ssLocal?.credential?.vct;
    const clientUri: string | undefined = ssLocal?.credential?.claims?.client_uri;
    // Build section title from VCT when present; otherwise fallback to generic Software Statement title
    const title = vct
      ? vct.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').trim()
      : t('developerAPIs.softwareStatementTitle');
    // Only include Client URI row (omit VCT row as per spec)
    rows.push({ label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: false });
    return { ssTitle: title, ssRows: rows };
  }, [ss, t]);

  const badgeLabel = trusted ? t('gettingStarted.viewCredential') : 'Credential Unavailable';

  const handleBadgeClick = () => {
    if (!trusted) return; // not clickable when unverified
    setOpen(true);
  };

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
        onClose={() => setOpen(false)}
        width={580}
        maxWidth={580}
        keepMounted
        height="100%"
        headerContent={(
          <Box sx={{ width: '100%' }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {t('gettingStarted.viewCredential')}
            </Typography>
          </Box>
        )}
        bannerContent={(
          <>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                alt="Banner"
                src={organisation?.coverImageUrl || defaultCoverImage}
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
                  src={organisation?.logoUrl || defaultLogoImg}
                  sx={{ position: 'absolute', left: 50, top: -65, width: 110, height: 110, border: '6px solid white', backgroundColor: 'white' }}
                />
              </Box>
            </Box>
          </>
        )}
        showBanner
        showFooter
        footerContent={(
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <Button className="delete-btn" variant="outlined" onClick={() => setOpen(false)} sx={{ minWidth: 120, textTransform: 'none' }}>
              {t('common.close')}
            </Button>
          </Box>
        )}
      >
        {/* Credentials content */}
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
        />

        {/* Software Statement section (if available) */}
        {ssRows.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography color="grey" mt={2} variant="subtitle1">
              {ssTitle}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <AttributeTable rows={ssRows} showValues={showValues} labelMinWidth={200} labelMaxPercent={40} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <IssuedExpiryStrip issued={(ss as any)?.createdAt} expiry={(ss as any)?.updatedAt} />
            </Box>
          </Box>
        )}
      </RightSidebar>
    </>
  );
};

export default ViewCredentialsController;
