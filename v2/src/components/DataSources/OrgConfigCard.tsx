"use client";

import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Tooltip, CircularProgress, Link as MuiLink } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ServiceOrganisationItem } from '@/types/serviceOrganisation';
import SoftwareStatementModal from '@/components/Account/DeveloperApis/SoftwareStatementModal';
import { AttributeRow } from '@/components/common/AttributeTable';
import { useGetSoftwareStatement } from '@/custom-hooks/developerApis';
import CopyButton from '@/components/common/CopyButton';
import '@/components/OrganisationDetails/style.scss';
import { usePathname } from 'next/navigation';
import { isPublicRoute } from '@/lib/apiService/utils';

type Props = {
  serviceItem: ServiceOrganisationItem;
};

const OrgConfigCard: React.FC<Props> = ({ serviceItem }) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [ssShowValues, setSsShowValues] = useState(true);
  const pathname = usePathname();
  const publicRoute = isPublicRoute(pathname || '/');
  // Protected hook (will only fetch when authenticated). Disable on public routes to avoid redundant calls.
  const { data: softwareStatementRes } = useGetSoftwareStatement({ enabled: !publicRoute });

  // Determine source of Software Statement
  const ssPublic = (serviceItem?.organisation as any)?.softwareStatement as any | undefined;
  const ssObj = (publicRoute ? ssPublic : (softwareStatementRes?.softwareStatement as any)) || undefined;
  // Status comes from protected response on private routes; from ssPublic.status on public routes
  const status = publicRoute ? ((ssPublic as any)?.status || '') : (softwareStatementRes?.status || '');
  const hasSoftwareStatement = !!ssObj && Object.keys(ssObj).length > 0 && status === 'credential_accepted';

  const openApiUrl = serviceItem?.organisation?.openApiUrl || '';
  const holderBaseUrl = serviceItem?.organisation?.verificationRequestURLPrefix || '';
  const credentialOfferEndpoint = (serviceItem?.organisation as any)?.credentialOfferEndpoint as string | undefined;
  const accessPointEndpoint = (serviceItem?.organisation as any)?.accessPointEndpoint as string | undefined;
  const hasEndpoints = !!(credentialOfferEndpoint && accessPointEndpoint);

  const vctRaw = (ssObj?.credential?.vct as string | undefined) || undefined;
  const vctTitle = useMemo(() => {
    const vct = vctRaw;
    if (!vct) return t('developerAPIs.softwareStatementTitle');
    return vct
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim();
  }, [vctRaw, t]);

  const ssRows = useMemo<AttributeRow[]>(() => {
    const clientUri = (ssObj?.credential?.claims as any)?.client_uri as string | undefined;
    const rows: AttributeRow[] = [];
    rows.push({ label: t('developerAPIs.softwareStatementClientUriLabel'), value: clientUri || '', href: clientUri || undefined, copy: true });
    return rows;
  }, [ssObj, t]);

  // Compute trusted from org identity verified flag with safe fallbacks
  const trusted = Boolean(
    (serviceItem as any)?.organisationIdentity?.presentationRecord?.verified ??
    (serviceItem as any)?.organisationIdentity?.isPresentationVerified ??
    (ssObj as any)?.isVerifiedWithTrustList ??
    false
  );

  return (
    <>
      <Card className='cardContainerList' sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ padding: '24px' }}>
          <Box sx={{ mb: 1, pb: 1, borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography color="black" variant="subtitle1" fontWeight="bold">
              {t('developerAPIs.walletConfigurationTitle')}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
            <Typography color="black" variant='body2'>{t('developerAPIs.openApiUrlLabel')}:</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              {openApiUrl ? (
                <MuiLink href={openApiUrl} target='_blank' rel='noreferrer' underline='hover' sx={{ color: '#0000FF', wordBreak: 'break-all', fontSize: '14px', display: 'block' }}>
                  {openApiUrl}
                </MuiLink>
              ) : (
                <Typography variant='body2' color='grey'>-</Typography>
              )}
              {!!openApiUrl && <CopyButton text={openApiUrl} />}
            </Box>

            <Typography color="black" variant='body2'>{t('developerAPIs.holderBaseUrlLabel')}:</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              {holderBaseUrl ? (
                <MuiLink href={holderBaseUrl} target='_blank' rel='noreferrer' underline='hover' sx={{ color: '#0000FF', wordBreak: 'break-all', fontSize: '14px', display: 'block' }}>
                  {holderBaseUrl}
                </MuiLink>
              ) : (
                <Typography variant='body2' color='grey'>-</Typography>
              )}
              {!!holderBaseUrl && <CopyButton text={holderBaseUrl} />}
            </Box>

            <Typography color="black" variant='body2'>{t('developerAPIs.credentialOfferEndpointLabel')}:</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              {credentialOfferEndpoint ? (
                <MuiLink href={credentialOfferEndpoint} target='_blank' rel='noreferrer' underline='hover' sx={{ color: '#0000FF', wordBreak: 'break-all', fontSize: '14px', display: 'block' }}>
                  {credentialOfferEndpoint}
                </MuiLink>
              ) : (
                <Typography variant='body2' color='grey'>-</Typography>
              )}
              {!!credentialOfferEndpoint && <CopyButton text={credentialOfferEndpoint} />}
            </Box>

            <Typography color="black" variant='body2'>{t('developerAPIs.accessPointEndpointLabel')}:</Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              {accessPointEndpoint ? (
                <MuiLink href={accessPointEndpoint} target='_blank' rel='noreferrer' underline='hover' sx={{ color: '#0000FF', wordBreak: 'break-all', fontSize: '14px', display: 'block' }}>
                  {accessPointEndpoint}
                </MuiLink>
              ) : (
                <Typography variant='body2' color='grey'>-</Typography>
              )}
              {!!accessPointEndpoint && <CopyButton text={accessPointEndpoint} />}
            </Box>

            <Typography color="black" variant='body2'>{t('developerAPIs.softwareStatementLabel')}:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {(() => {
                const ssEmpty = !ssObj || Object.keys(ssObj || {}).length === 0;
                const available = !ssEmpty && status === 'credential_accepted';
                const tooltip = !hasEndpoints
                  ? t('developerAPIs.softwareStatementPrereqMissing')
                  : t(`developerAPIs.softwareStatementStatus.${status}` as const);
                return available ? (
                  <Tooltip title={t('developerAPIs.softwareStatementViewTooltip')} arrow>
                    <Button
                      variant='text'
                      className={'view-credential'}
                      onClick={() => setOpen(true)}
                      sx={{
                        p: 0,
                        minWidth: 'auto',
                        textTransform: 'none !important',
                        color: '#000 !important',
                        fontSize: '0.825rem',
                        textDecoration: 'underline',
                        textUnderlineOffset: '0.25rem',
                        '&:hover': { backgroundColor: 'transparent' },
                      }}
                    >
                      {t('gettingStarted.viewCredential')}
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title={tooltip} arrow>
                    <span style={{ cursor: 'not-allowed' }}>
                      <Button
                        variant='text'
                        className={'view-credential'}
                        disabled
                        sx={{
                          p: 0,
                          minWidth: 'auto',
                          textTransform: 'none !important',
                          color: '#000 !important',
                          fontSize: '0.825rem',
                          textDecoration: 'underline',
                          textUnderlineOffset: '0.25rem',
                          '&:hover': { backgroundColor: 'transparent' },
                          '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed' },
                        }}
                      >
                        {t('gettingStarted.viewCredential')}
                      </Button>
                    </span>
                  </Tooltip>
                );
              })()}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <SoftwareStatementModal
        open={open}
        onClose={() => setOpen(false)}
        title={vctTitle}
        rows={[
          ...ssRows,
          ...(ssObj?.createdAt ? [{ label: '', value: ssObj.createdAt as any, key: '__issued' } as any] : []),
          ...(ssObj?.updatedAt ? [{ label: '', value: ssObj.updatedAt as any, key: '__expiry' } as any] : []),
        ]}
        showValues={ssShowValues}
        setShowValues={setSsShowValues}
        enableToggle={true}
        organisationName={serviceItem?.organisation?.name}
        overview={serviceItem?.organisation?.description}
        trusted={trusted}
        drawerWidth={580}
        isDeleteEnabled={false}
      />
    </>
  );
};

export default OrgConfigCard;
