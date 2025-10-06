  "use client";

import React from 'react';
import Link from 'next/link';
import { Box, Button, TextField, Typography, MenuItem, CircularProgress, Avatar } from '@mui/material';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { MAX_SHORT, MAX_DESC, PASSWORD_MAX, OnboardingAdminFields, OnboardingOrganisationFields } from './useOnboardingForm';
import { useOnboarding } from './useOnboarding';
import { useUpdateOrganisation, useCreateOrgIdentity, useGetCoverImage, useGetLogoImage, useOrgIdentityPolling, useGetCodeOfConductPdf, useSignCodeOfConduct } from '@/custom-hooks/gettingStarted';
import { useQueryClient } from '@tanstack/react-query';
import { defaultLogoImg } from '@/constants/defalultImages';
import RightSidebar from '@/components/common/RightSidebar';
import ViewCredentials from '@/components/ViewCredentials';
import DeleteCredentialsModal from '@/components/OrganisationDetails/DeleteCredentialsModal';
import { countries } from '@/assets/data/countries';

import '../Signup/style.scss';
import '../Account/style.scss';

type Translate = ReturnType<typeof useTranslations>;

// Step 5: Code of Conduct signing
const CodeOfConductSetup = React.memo(({ t, pdfUrl, isError, error }: { t: Translate; pdfUrl?: string; isError?: boolean; error?: Error | null; }) => {
  const router = useRouter();
  const locale = useLocale();
  const { mutate: sign, isPending } = useSignCodeOfConduct();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  // Note: App-level gating handles redirect after completion; avoid doing it here to prevent URL jumping.

  // Do not revoke blob URL on unmount. Keeping the object URL alive avoids breaking the PDF
  // if the user navigates away from this step and returns without refetching it.

  React.useEffect(() => {
    const onFsChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  const resolvedPdf = React.useMemo(() => {
    if (pdfUrl && pdfUrl !== '/coc-fallback') return pdfUrl;
    return `/${locale}/coc-fallback`;
  }, [pdfUrl, locale]);

  // Treat explicit fallback as missing CoC from backend
  const isMissingCoc = React.useMemo(() => {
    // When API returns fallback path or query errored, consider CoC as missing
    return Boolean(isError || !pdfUrl || pdfUrl === '/coc-fallback');
  }, [isError, pdfUrl]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>

      <Box
        sx={{ width: '100%', maxWidth: 500, minHeight: 360, height: isFullScreen ? '100vh' : { xs: '60vh', sm: '480px' }, border: '1px solid #C9C9C9', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}
        aria-live="polite"
        aria-busy={false}
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!isMissingCoc && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>
            <Button
              size="small"
              variant="outlined"
              className="delete-btn"
              onClick={toggleFullScreen}
              startIcon={isFullScreen ? <FullscreenExit sx={{ fontSize: 18 }} /> : <Fullscreen sx={{ fontSize: 18 }} />}
              sx={{
                minHeight: 28,
                textTransform: 'none',
                lineHeight: 1.2,
                display: 'inline-flex',
                alignItems: 'center',
                borderColor: '#DFDFDF',
                color: 'black',
                '&:hover': { borderColor: 'black' }
              }}
            >
              {isFullScreen ? t('onboarding.controls.exitFullscreen') : t('onboarding.controls.enterFullscreen')}
            </Button>
          </Box>
        )}
        <>
          {isMissingCoc ? (
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }} role="alert">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {t('common.unableToDisplayPdf')}
                  </Typography>
                  {error?.message ? (
                    <Typography variant="caption" color="text.secondary">{error.message}</Typography>
                  ) : null}
                </Box>
              </Box>
            ) : (
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
                <object
                  data={resolvedPdf}
                  type="application/pdf"
                  width="100%"
                  height={'100%'}
                  role="document"
                  title="Code of Conduct PDF"
                  aria-label="Code of Conduct PDF"
                  tabIndex={0}
                  style={{ display: 'block', width: '100%', height: '100%', flex: 1 }}
                >
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="body2">{t('common.unableToDisplayPdf')}</Typography>
                    <Typography variant="body2"><a href={resolvedPdf} target="_blank" rel="noreferrer" aria-label="Open Code of Conduct PDF in a new tab">{t('common.openInNewTab')}</a></Typography>
                  </Box>
                </object>
              </Box>
            )}
          </>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 500, mt: '12px' }}>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          disabled={isPending || isMissingCoc}
          onClick={() => sign(undefined, { onSuccess: () => router.push('/start') })}
          sx={{
            width: '100%',
            ...DISABLED_BUTTON_SX,
          }}
        >
          {t('common.signAndContinue')}
        </Button>
      </Box>
    </Box>
  );
});

CodeOfConductSetup.displayName = 'StepFive';

const STEP_ONE_FORM_ID = 'onboarding-step-one-form';
const STEP_TWO_FORM_ID = 'onboarding-step-two-form';
const FORM_MIN_WIDTH = 320;
const PLACEHOLDER_SX = {
  '& .MuiInputBase-input::placeholder': {
    opacity: 1,
    color: '#9c9c9c',
  },
};

const OUTLINED_INPUT_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '7px',
  },
} as const;

const DISABLED_BUTTON_SX = {
  '&.Mui-disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'auto',
    color: '#9e9e9e !important',
    borderColor: '#E0E0E0 !important',
    backgroundColor: '#f5f5f5 !important',
  },
  '&.Mui-disabled:hover': {
    backgroundColor: '#f5f5f5 !important',
    borderColor: '#E0E0E0 !important',
    color: '#9e9e9e !important',
  },
} as const;

// Step 4: Business Wallet verification and credentials
const OrgIdentitySetup = React.memo(({ t, onBack, organisation, orgIdentity, onNext }: { t: Translate; onBack: () => void; organisation: any | undefined; orgIdentity: any | undefined; onNext: () => void; }) => {
  const [walletUrl, setWalletUrl] = React.useState('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openDeleteCredentials, setOpenDeleteCredentials] = React.useState(false);
  const isValidUrl = React.useMemo(() => {
    try {
      if (!walletUrl) return false;
      const u = new URL(walletUrl);
      return !!u.protocol && !!u.host;
    } catch { return false; }
  }, [walletUrl]);

  // Fetch org data after login
  const queryClient = useQueryClient();
  const orgId = organisation?.id || 'current';
  const { mutateAsync: updateOrganisation, isPending: updating } = useUpdateOrganisation();
  const { mutateAsync: createOrgIdentity, isPending: creating } = useCreateOrgIdentity();
  // Lazy-load banner/logo only when the credentials drawer is opened
  const { data: coverImageBase64 } = useGetCoverImage(drawerOpen);
  const { data: logoImageBase64 } = useGetLogoImage(drawerOpen);

  const isVerified = Boolean(orgIdentity?.verified || (orgIdentity as any)?.organisationalIdentity?.verified);
  const hasIdentity = !!orgIdentity && !!(orgIdentity as any)?.organisationalIdentity && Object.keys((orgIdentity as any)?.organisationalIdentity || {}).length > 0;

  // Ensure we poll identity until it verifies (same behavior as /start)
  useOrgIdentityPolling(orgIdentity as any, orgId);

  // Prefill wallet address from existing organisation value if available and input not touched
  React.useEffect(() => {
    const existing = organisation?.verificationRequestURLPrefix || '';
    if (existing && !walletUrl) {
      setWalletUrl(existing);
    }
  }, [organisation?.verificationRequestURLPrefix, walletUrl]);

  // If a verification URL prefix exists, force-fetch org identity on load so the button can appear immediately when verified
  React.useEffect(() => {
    if (organisation?.verificationRequestURLPrefix) {
      queryClient.invalidateQueries({ queryKey: ['orgIdentity', orgId] });
    }
  }, [organisation?.verificationRequestURLPrefix, orgId, queryClient]);

  // On tab refocus, re-fetch organisation identity
  React.useEffect(() => {
    const onFocus = () => {
      try { queryClient.invalidateQueries({ queryKey: ['orgIdentity', orgId] }); } catch {}
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [orgId, queryClient]);

  const handleContinue = async () => {
    if (!organisation) return;
    // Allow empty wallet to proceed; if non-empty but invalid, block
    if (walletUrl && !isValidUrl) return;
    try {
      // Update organisation; only include verificationRequestURLPrefix when provided to avoid overwriting with empty
      const baseOrg = { ...organisation } as any;
      const orgPayload = walletUrl ? { ...baseOrg, verificationRequestURLPrefix: walletUrl } : baseOrg;
      const payload = { organisation: orgPayload } as any;
      await updateOrganisation(payload);
      queryClient.invalidateQueries({ queryKey: ['organisation'] });
      // Trigger credentials (redirect to QR like /start page)
      const created = await createOrgIdentity();
      const qr = (created as any)?.organisationalIdentity?.vpTokenQrCode as string | undefined;
      if (qr) {
        try {
          window.open(qr, '_blank', 'noopener');
        } catch {
          // ignore popup errors – user can retry from the app
        }
      }
      queryClient.invalidateQueries({ queryKey: ['orgIdentity', orgId] });
    } catch (e) {
      // swallow for now; error toasts are handled globally by hooks
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <TextField
          variant="outlined"
          placeholder={t('signup.verificationRequestURLPrefix')}
          value={walletUrl}
          onChange={(e) => setWalletUrl(e.target.value)}
          fullWidth
          error={!!walletUrl && !isValidUrl}
          helperText={!!walletUrl && !isValidUrl ? t('common.invalidUrl') : undefined}
          multiline
          minRows={3}
          inputProps={{
            style: {
              fontSize: '14px',
              lineHeight: 1.5,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              color: 'rgba(0, 0, 0, 0.87)',
            },
          }}
        />
      </Box>

      {isVerified && (
        <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'left' }}>
          <Button
            variant="outlined"
            className="delete-btn"
            onClick={() => setDrawerOpen(true)}
            sx={{ width: '100%', textAlign: 'left', borderColor: '#DFDFDF', color: 'black', borderRadius: '7px', textTransform: 'none' }}
          >
            LEGAL PERSON IDENTIFICATION DATA
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', width: '100%', maxWidth: 500 }}>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={() => { if (isVerified) { onNext(); } else { handleContinue(); } }}
          disabled={isVerified ? (updating || creating) : ((walletUrl ? !isValidUrl : false) || updating || creating)}
          sx={{ width: '100%', ...DISABLED_BUTTON_SX }}
        >
          {updating || creating ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} /> {t('common.loading')}
            </>
          ) : t('common.continue')}
        </Button>
      </Box>

      <RightSidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={580}
        maxWidth={580}
        keepMounted
        height="100%"
        headerContent={<Box sx={{ width: '100%' }}><Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>LEGAL PERSON IDENTIFICATION DATA</Typography></Box>}
        bannerContent={(
          <>
            <Box
              component="div"
              style={{
                height: '194px',
                width: '100%',
                backgroundImage: coverImageBase64 ? `url(${coverImageBase64})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: coverImageBase64 ? 'transparent' : '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px'
              }}
            />
            <Box sx={{ position: 'relative', height: '65px', left: -25 }}>
              <Avatar
                src={logoImageBase64 || defaultLogoImg}
                sx={{ position: 'absolute', left: 50, top: -65, width: 110, height: 110, border: '6px solid white', backgroundColor: 'white' }}
              />
            </Box>
          </>
        )}
        showBanner={true}
        showFooter={true}
        footerContent={(
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <Button
              onClick={() => setDrawerOpen(false)}
              className="delete-btn"
              sx={{
                minWidth: 120,
                textTransform: 'none',
                borderColor: '#DFDFDF',
                color: 'black',
                borderRadius: '0 !important',
                '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
              }}
              variant="outlined"
            >
              {t('common.close')}
            </Button>
            {hasIdentity && (
              <Button
                onClick={() => setOpenDeleteCredentials(true)}
                className="delete-btn"
                variant="outlined"
                sx={{
                  minWidth: 120,
                  textTransform: 'none',
                  borderColor: '#DFDFDF',
                  color: 'black',
                  borderRadius: '0 !important',
                  '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
                }}
              >
                {t('common.delete')}
              </Button>
            )}
          </Box>
        )}
      >
        <ViewCredentials orgIdentity={orgIdentity} organisation={organisation} showValues />
      </RightSidebar>

      <DeleteCredentialsModal
        open={openDeleteCredentials}
        setOpen={setOpenDeleteCredentials}
        onSuccess={() => setDrawerOpen(false)}
      />
    </Box>
  );
});

OrgIdentitySetup.displayName = 'StepFour';

const Onboarding: React.FC = () => {
  const t = useTranslations();
  // central hook with all logic
  const onboarding = useOnboarding();
  // Measure heading/subtitle actual rendered width to synchronize form and buttons width
  const headingRef = React.useRef<HTMLDivElement | null>(null);
  const [headingWidth, setHeadingWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const update = () => {
      try {
        const rect = el.getBoundingClientRect();
        setHeadingWidth(Math.min(500, Math.max(0, Math.round(rect.width))));
      } catch {}
    };
    update();
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } catch {
      // fallback: window resize
      window.addEventListener('resize', update);
    }
    return () => {
      try { ro?.disconnect(); } catch {}
      window.removeEventListener('resize', update);
    };
  }, []);
  // Debug controls hidden by default
  const showStepDebugControls = false;
  const {
    // form
    currentStep,
    adminCredentials,
    organisationDetails,
    showErrors,
    isStepOneValid,
    isStepTwoValid,
    emailInvalid,
    passwordLengthInvalid,
    passwordsMismatch,
    updateField,
    goToStepTwo,
    goToStepOne,
    submitOrganisationDetails,
    isRegistering,
    isLoggingIn,
    autoLogin,
    goToStepTwoNav,
    goToStepThreeNav,
    goToStepFourNav,
    goToStepFiveNav,
    // datasets
    sectors,
    sectorsLoading,
    // flags
    manualStepOverrideRef,
    organisation,
    orgIdentity,
    isProtectedMode,
    canSkipStepOne,
    displayStep,
    renderStep,
    showGlobalSpinner,
  } = onboarding;

  // Make the form width match the heading/subtitle width across steps.
  // If heading is hidden (e.g., step 3), reuse the last measured heading width.
  const contentWidth = React.useMemo(() => {
    return typeof headingWidth === 'number' ? headingWidth : '100%';
  }, [headingWidth]);

  // Centralize CoC PDF loading to avoid an internal spinner in the CoC step
  const { data: pdfUrl, isLoading: pdfLoading, isError: pdfIsError, error: pdfError } = useGetCodeOfConductPdf();

  // Early return during loading/redirect
  if (showGlobalSpinner || (renderStep === 5 && pdfLoading)) {
    return (
      <Box className="loginWrapper">
        <Box className="loginContainer">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
            <CircularProgress size={24} aria-label="Loading onboarding step" />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="loginWrapper">
      <Box
        className="loginContainer"
        sx={{
          width: '100%',
          px: { xs: 2, sm: 0 },
          // Force onboarding text-field containers to align with header width and be centered
          '& .text-field': {
            width: '100% !important',
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Onboarding page header (title + optional subtitle). Hidden on step 3 (post-register success screen). */}
        {displayStep !== 3 && (
          <Box sx={{ mt: '1rem', mb: '1.5rem', textAlign: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
              <Box ref={headingRef} sx={{ display: 'inline-block', maxWidth: 500, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700}>{t('onboarding.title')}</Typography>
                {(() => {
                  let subtitleKey: string | null = null;
                  if (displayStep === 1) subtitleKey = 'onboarding.stepSubtitles.step1';
                  else if (displayStep === 2) subtitleKey = 'onboarding.stepSubtitles.step2';
                  else if (displayStep === 4) subtitleKey = 'onboarding.stepSubtitles.step3';
                  else if (displayStep === 5) subtitleKey = 'onboarding.stepSubtitles.step4';

                  return subtitleKey ? (
                    <Typography
                      variant="h6"
                      sx={{ mt: 1.25, color: 'inherit', fontWeight: 600 }}
                    >
                      {t(subtitleKey)}
                    </Typography>
                  ) : null;
                })()}
              </Box>
            </Box>
          </Box>
        )}

        {/* Step switch controls: allow freely switching between steps (unauthenticated and protected) */}
        {showStepDebugControls && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', gap: 1, mx: 'auto', justifyContent: 'center' }}>
              <Button size="small" variant="outlined" className="delete-btn" onClick={() => { manualStepOverrideRef.current = true; goToStepOne(); }}>Step 1</Button>
              <Button size="small" variant="outlined" className="delete-btn" onClick={() => { manualStepOverrideRef.current = true; goToStepTwoNav(); }}>Step 2</Button>
              <Button size="small" variant="outlined" className="delete-btn" onClick={() => { manualStepOverrideRef.current = true; goToStepThreeNav(); }}>Step 3</Button>
              <Button size="small" variant="outlined" className="delete-btn" onClick={() => { manualStepOverrideRef.current = true; if (typeof goToStepFourNav === 'function') goToStepFourNav(); }}>Step 4</Button>
            </Box>
          </Box>
        )}

        {manualStepOverrideRef.current ? (
            // Manual override: render exact step by currentStep
            currentStep === 1 ? (
              <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: 0 }}>
                <AdminCredentialsStep
                  t={t}
                  values={adminCredentials}
                  showErrors={showErrors.step1}
                  onChange={updateField}
                  onSubmit={goToStepTwo}
                  emailInvalid={emailInvalid}
                  passwordLengthInvalid={passwordLengthInvalid}
                  passwordsMismatch={passwordsMismatch}
                  formId={STEP_ONE_FORM_ID}
                  isValid={isStepOneValid}
                />
              </Box>
            ) : currentStep === 2 ? (
              <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: 0 }}>
                <OrganisationDetailsStep
                  t={t}
                  values={organisationDetails}
                  showErrors={showErrors.step2}
                  onChange={updateField}
                  onSubmit={submitOrganisationDetails}
                  onBack={goToStepOne}
                  formId={STEP_TWO_FORM_ID}
                  isValid={isStepTwoValid}
                  isSubmitting={isRegistering}
                  sectors={sectors}
                  sectorsLoading={sectorsLoading}
                />
              </Box>
            ) : currentStep === 3 ? (
              <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                <LoginAssist t={t} onBack={goToStepTwoNav} onContinue={autoLogin} isSubmitting={isLoggingIn} />
              </Box>
            ) : renderStep === 4 ? (
              <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                <OrgIdentitySetup t={t} onBack={goToStepThreeNav} organisation={organisation} orgIdentity={orgIdentity} onNext={goToStepFiveNav} />
              </Box>
            ) : (
              <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                <CodeOfConductSetup t={t} pdfUrl={pdfUrl} isError={pdfIsError} error={pdfError as Error | null} />
              </Box>
            )
          ) : (
            // If authenticated (organisation present), never show steps 1-3.
            isProtectedMode ? (
              renderStep === 4 ? (
                <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                  <OrgIdentitySetup t={t} onBack={goToStepThreeNav} organisation={organisation} orgIdentity={orgIdentity} onNext={goToStepFiveNav} />
                </Box>
              ) : (
                <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                  <CodeOfConductSetup t={t} pdfUrl={pdfUrl} isError={pdfIsError} error={pdfError as Error | null} />
                </Box>
              )
            ) : (
              // Unauthenticated: show registration steps 1-3 normally. If user has progressed to step >= 4 (after silent login),
              // the authenticated branch will render Step 4/5.
              currentStep === 1 ? (
                <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                  <AdminCredentialsStep
                    t={t}
                    values={adminCredentials}
                    showErrors={showErrors.step1}
                    onChange={updateField}
                    onSubmit={goToStepTwo}
                    emailInvalid={emailInvalid}
                    passwordLengthInvalid={passwordLengthInvalid}
                    passwordsMismatch={passwordsMismatch}
                    formId={STEP_ONE_FORM_ID}
                    isValid={isStepOneValid}
                  />
                </Box>
              ) : currentStep === 2 ? (
                <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                  <OrganisationDetailsStep
                    t={t}
                    values={organisationDetails}
                    showErrors={showErrors.step2}
                    onChange={updateField}
                    onSubmit={submitOrganisationDetails}
                    onBack={goToStepOne}
                    formId={STEP_TWO_FORM_ID}
                    isValid={isStepTwoValid}
                    isSubmitting={isRegistering}
                    sectors={sectors}
                    sectorsLoading={sectorsLoading}
                  />
                </Box>
              ) : (
                <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH }}>
                  <LoginAssist t={t} onBack={goToStepTwoNav} onContinue={autoLogin} isSubmitting={isLoggingIn} />
                </Box>
              )
            )
          )
        }

        {displayStep === 1 && (
          <Box sx={{ width: contentWidth, maxWidth: 500, mx: 'auto', px: { xs: 1, sm: 0 }, minWidth: FORM_MIN_WIDTH, mt: '12px', display: 'flex', justifyContent: 'center' }}>
            <Button
              type={canSkipStepOne ? 'button' : 'submit'}
              form={canSkipStepOne ? undefined : STEP_ONE_FORM_ID}
              onClick={canSkipStepOne ? goToStepTwoNav : undefined}
              variant="outlined"
              className="delete-btn"
              disabled={!canSkipStepOne && !isStepOneValid}
              sx={{ 
                width: '100%', 
                maxWidth: 500,
                ...DISABLED_BUTTON_SX,
                '&.MuiButton-root': {
                  height: '48px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }
              }}
            >
              {t('common.continue')}
            </Button>
          </Box>
        )}

        {displayStep <= 2 && (
          <Typography variant="body2" sx={{ color: '#A1A1A1', marginTop: '1.5rem', textAlign: 'center' }}>
            {t('signup.haveAccount')}{' '}
            <Link className="appLink" href="/login">
              {t('signup.login')}
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

interface AdminCredentialsStepProps {
  t: Translate;
  values: OnboardingAdminFields;
  showErrors: boolean;
  emailInvalid: boolean;
  passwordLengthInvalid: boolean;
  passwordsMismatch: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formId: string;
  isValid: boolean;
}

const AdminCredentialsStep: React.FC<AdminCredentialsStepProps> = React.memo(({
  t,
  values: { userName, email, password, confirmPassword },
  showErrors,
  emailInvalid,
  passwordLengthInvalid,
  passwordsMismatch,
  onChange,
  onSubmit,
  formId,
  isValid,
}) => {
  const isInvalid = {
    userName: showErrors && !userName,
    email: showErrors && (!email || emailInvalid),
    password: showErrors && (!password || passwordLengthInvalid),
    confirmPassword: showErrors && (!confirmPassword || passwordsMismatch),
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const form = (event.currentTarget as HTMLElement).closest('form') as HTMLFormElement | null;
      form?.requestSubmit();
    }
  };

  return (
    <form id={formId} noValidate onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <TextField
              name="userName"
              type="text"
              value={userName}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Your Admin Name"
              fullWidth
              error={Boolean(isInvalid.userName)}
              helperText={isInvalid.userName ? t('signup.required') : ''}
              inputProps={{ maxLength: MAX_SHORT }}
              autoComplete="name"
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />

            <TextField
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Email"
              fullWidth
              error={Boolean(isInvalid.email)}
              helperText={
                isInvalid.email
                  ? email && emailInvalid
                    ? t('onboarding.validation.invalidEmail')
                    : t('signup.required')
                  : ''
              }
              inputProps={{ maxLength: MAX_SHORT }}
              autoComplete="email"
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />

            <TextField
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Password"
              fullWidth
              error={Boolean(isInvalid.password)}
              helperText={
                isInvalid.password
                  ? passwordLengthInvalid
                    ? t('signup.passwordLength')
                    : t('signup.required')
                  : ''
              }
              inputProps={{ maxLength: PASSWORD_MAX, minLength: 8 }}
              autoComplete="new-password"
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />

            <TextField
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Confirm Password"
              fullWidth
              error={Boolean(isInvalid.confirmPassword)}
              helperText={
                isInvalid.confirmPassword
                  ? passwordsMismatch
                    ? t('signup.passwordMismatch')
                    : t('signup.required')
                  : ''
              }
              inputProps={{ maxLength: PASSWORD_MAX, minLength: 8 }}
              autoComplete="new-password"
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />
          </Box>
        </Box>
      </Box>
    </form>
  );
});

AdminCredentialsStep.displayName = 'AdminCredentialsStep';

interface OrganisationDetailsStepProps {
  t: Translate;
  values: OnboardingOrganisationFields;
  showErrors: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  formId: string;
  isValid: boolean;
  isSubmitting: boolean;
  sectors: Array<{ id: string; sectorName: string }>;
  sectorsLoading: boolean;
}

const OrganisationDetailsStep: React.FC<OrganisationDetailsStepProps> = React.memo(({
  t,
  values: { organisationName, organisationDescription, policyUrl, sector, location },
  showErrors,
  onChange,
  onSubmit,
  onBack,
  formId,
  isValid,
  isSubmitting,
  sectors,
  sectorsLoading,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const form = (event.currentTarget as HTMLElement).closest('form') as HTMLFormElement | null;
      form?.requestSubmit();
    }
  };

  return (
    <form id={formId} noValidate onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
            <TextField
              name="organisationName"
              type="text"
              value={organisationName}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Organisation Name"
              fullWidth
              inputProps={{ maxLength: MAX_SHORT }}
              error={showErrors && !organisationName}
              helperText={showErrors && !organisationName ? t('signup.required') : ''}
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />

            <TextField
              name="organisationDescription"
              multiline
              minRows={3}
              maxRows={6}
              value={organisationDescription}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Organisation Description"
              fullWidth
              inputProps={{ maxLength: MAX_DESC }}
              helperText={showErrors && !organisationDescription ? t('signup.required') : undefined}
              error={showErrors && !organisationDescription}
              sx={{
                ...PLACEHOLDER_SX,
                ...OUTLINED_INPUT_SX,
                '& .MuiInputBase-root': { alignItems: 'center' },
              }}
            />

            <TextField
              name="policyUrl"
              type="url"
              value={policyUrl}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Policy URL"
              fullWidth
              inputProps={{ maxLength: MAX_SHORT }}
              error={showErrors && !policyUrl}
              helperText={showErrors && !policyUrl ? t('signup.required') : ''}
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
            />

            <TextField
              select
              name="sector"
              value={sector}
              onChange={(e) => onChange({ target: { name: 'sector', value: e.target.value } } as any)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Sector"
              fullWidth
              error={showErrors && !sector}
              helperText={showErrors && !sector ? t('signup.required') : ''}
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                {sectorsLoading ? t('common.loading') : 'Sector'}
              </MenuItem>
              {sectors.map((s) => (
                <MenuItem key={s.id} value={s.sectorName}>{s.sectorName}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="location"
              value={location}
              onChange={(e) => onChange({ target: { name: 'location', value: e.target.value } } as any)}
              onKeyDown={handleKeyDown}
              variant="outlined"
              placeholder="Country"
              fullWidth
              error={showErrors && !location}
              helperText={showErrors && !location ? t('signup.required') : ''}
              sx={{ ...PLACEHOLDER_SX, ...OUTLINED_INPUT_SX }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                Country
              </MenuItem>
              {countries.map((c) => (
                <MenuItem key={c.value} value={c.label}>{c.label}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '3fr 7fr' },
          gap: '12px',
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          minWidth: 0,
          '& .MuiButton-root': {
            height: '48px',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }
        }}>
          <Button
            type="button"
            variant="outlined"
            className="delete-btn"
            onClick={onBack}
            disabled={isSubmitting}
            sx={{ 
              width: '100%',
              minWidth: 'auto',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...DISABLED_BUTTON_SX,
            }}
          >
            {t('common.back')}
          </Button>
          <Button
            type="submit"
            variant="outlined"
            className="delete-btn"
            disabled={!isValid || isSubmitting}
            sx={{ 
              width: '100%',
              minWidth: 'auto',
              ...DISABLED_BUTTON_SX,
            }}
          >
            {t('common.continue')}
          </Button>
        </Box>
      </Box>
    </form>
  );
});

interface StepThreeProps {
  t: Translate;
  onBack: () => void;
  onContinue: () => void;
  isSubmitting: boolean;
}

const LoginAssist: React.FC<StepThreeProps> = React.memo(({ t, onBack, onContinue, isSubmitting }) => {
  const locale = useLocale();
  const loginHref = locale ? `/${locale}/login` : '/login';
  const successContent = t.rich('onboarding.step3.successMessage', {
    loginLink: (chunks) => (
      <Link className="appLink" href={loginHref}>
        {chunks}
      </Link>
    ),
    loginText: t('signup.login'),
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: 500, minWidth: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CheckIcon fontSize="inherit" sx={{ color: '#FFFFFF', fontSize: 20 }} />
        </Box>
        <Typography variant="body1" sx={{ flex: '1 1 auto', minWidth: 0, wordBreak: 'break-word', whiteSpace: 'normal' }}>
          {successContent}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '3fr 7fr' },
        gap: '12px',
        width: '100%',
        maxWidth: 500,
        minWidth: 0,
        mx: 'auto',
        mt: '12px',
        '& .MuiButton-root': {
          height: '48px',
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
        }
      }}>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={onBack}
          disabled={isSubmitting}
          sx={{ 
            width: '100%',
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...DISABLED_BUTTON_SX,
          }}
        >
          {t('common.back')}
        </Button>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={onContinue}
          disabled={isSubmitting}
          sx={{ 
            width: '100%',
            minWidth: 'auto',
            position: 'relative',
            ...DISABLED_BUTTON_SX,
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} /> {t('common.loading')}
            </>
          ) : t('common.continue')}
        </Button>
      </Box>
    </Box>
  );
});
LoginAssist.displayName = 'StepThree';

OrganisationDetailsStep.displayName = 'OrganisationDetailsStep';

export default Onboarding;