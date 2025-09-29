  "use client";

import React from 'react';
import Link from 'next/link';
import { Box, Button, Divider, TextField, Typography, MenuItem, CircularProgress, Avatar } from '@mui/material';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { useOnboardingForm, MAX_SHORT, MAX_DESC, PASSWORD_MAX, OnboardingAdminFields, OnboardingOrganisationFields } from './useOnboardingForm';
import { useSectors } from '@/custom-hooks/onboarding';
import { useGetOrganisation, useGetOrgIdentity, useUpdateOrganisation, useCreateOrgIdentity, useGetCoverImage, useGetLogoImage, useOrgIdentityPolling, useGetCodeOfConductPdf, useSignCodeOfConduct } from '@/custom-hooks/gettingStarted';
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
const StepFive = React.memo(({ t }: { t: Translate }) => {
  const router = useRouter();
  const locale = useLocale();
  const { data: pdfUrl, isLoading, isError, error } = useGetCodeOfConductPdf();
  const { mutate: sign, isPending } = useSignCodeOfConduct();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  // Note: App-level gating handles redirect after completion; avoid doing it here to prevent URL jumping.

  // Revoke blob URL when component unmounts or URL changes
  React.useEffect(() => {
    return () => {
      try { if (pdfUrl && pdfUrl.startsWith('blob:')) URL.revokeObjectURL(pdfUrl); } catch {}
    };
  }, [pdfUrl]);

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
    return (!isLoading) && (isError || pdfUrl === '/coc-fallback');
  }, [isLoading, isError, pdfUrl]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>

      <Box
        sx={{ width: '100%', maxWidth: 600, minHeight: 360, border: '1px solid #C9C9C9', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}
        aria-live="polite"
        aria-busy={isLoading ? 'true' : 'false'}
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: isFullScreen ? '100vh' : undefined,
          maxHeight: isFullScreen ? '100vh' : undefined,
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
        {isLoading ? (
          <Box sx={{ height: isFullScreen ? '100vh' : 360, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <CircularProgress size={24} aria-label="Loading Code of Conduct PDF" />
          </Box>
        ) : (
          <>
            {isMissingCoc ? (
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }} role="alert">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {/* Prefer specific copy; fall back to generic key if available */}
                    {t?.('common.unableToDisplayPdf')}
                  </Typography>
                  {error?.message ? (
                    <Typography variant="caption" color="text.secondary">{error.message}</Typography>
                  ) : null}
                </Box>
              </Box>
            ) : (
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <object
                  data={resolvedPdf}
                  type="application/pdf"
                  width="100%"
                  height={isFullScreen ? '100%' : '480px'}
                  role="document"
                  title="Code of Conduct PDF"
                  aria-label="Code of Conduct PDF"
                  tabIndex={0}
                  style={{ display: 'block' }}
                >
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="body2">{t('common.unableToDisplayPdf')}</Typography>
                    <Typography variant="body2"><a href={resolvedPdf} target="_blank" rel="noreferrer" aria-label="Open Code of Conduct PDF in a new tab">{t('common.openInNewTab')}</a></Typography>
                  </Box>
                </object>
              </Box>
            )}
          </>
        )}
      </Box>

      <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          disabled={isPending || isMissingCoc}
          onClick={() => sign(undefined, { onSuccess: () => router.push('/start') })}
          sx={{
            width: '100%',
            '&.Mui-disabled': {
              cursor: 'not-allowed',
              pointerEvents: 'auto',
              opacity: 0.6,
              color: '#9e9e9e !important',
              borderColor: '#E0E0E0 !important',
              backgroundColor: '#f5f5f5 !important',
            },
          }}
        >
          {t('common.signAndContinue')}
        </Button>
      </Box>
    </Box>
  );
});

StepFive.displayName = 'StepFive';

const STEP_ONE_FORM_ID = 'onboarding-step-one-form';
const STEP_TWO_FORM_ID = 'onboarding-step-two-form';
const PLACEHOLDER_SX = {
  '& .MuiInputBase-input::placeholder': {
    opacity: 1,
    color: '#9c9c9c',
  },
};

// Step 4: Business Wallet verification and credentials
const StepFour = React.memo(({ t, onBack, organisation, orgIdentity, onNext }: { t: Translate; onBack: () => void; organisation: any | undefined; orgIdentity: any | undefined; onNext: () => void; }) => {
  const [walletUrl, setWalletUrl] = React.useState('');
  const [walletTouched, setWalletTouched] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openDeleteCredentials, setOpenDeleteCredentials] = React.useState(false);
  const [popupBlocked, setPopupBlocked] = React.useState(false);
  const [qrUrlFallback, setQrUrlFallback] = React.useState<string | null>(null);
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
    if (!walletTouched && existing && walletUrl !== existing) {
      setWalletUrl(existing);
    }
  }, [organisation?.verificationRequestURLPrefix, walletTouched, walletUrl]);

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
          const newTab = window.open(qr, '_blank', 'noopener');
          if (!newTab) {
            // Pop-up likely blocked. Do not navigate current tab; show a safe fallback link instead.
            setPopupBlocked(true);
            setQrUrlFallback(qr);
          } else {
            setPopupBlocked(false);
            setQrUrlFallback(null);
          }
        } catch {
          // Do not change current tab. Provide a fallback link for the user to click manually.
          setPopupBlocked(true);
          setQrUrlFallback(qr);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['orgIdentity', orgId] });
      setSubmitted(true);
    } catch (e) {
      // swallow for now; error toasts are handled globally by hooks
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 350 }}>
        <TextField
          variant="outlined"
          placeholder={t('signup.verificationRequestURLPrefix')}
          value={walletUrl}
          onChange={(e) => { setWalletUrl(e.target.value); setWalletTouched(true); }}
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
        <Box sx={{ width: '100%', maxWidth: 350, mt: 2, textAlign: 'left' }}>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', width: '100%', maxWidth: 350, mt: 1.5 }}>
        {!isVerified && (
          <Button
            type="button"
            variant="outlined"
            className="delete-btn"
            onClick={onBack}
            disabled={updating || creating}
            sx={{ flex: 1, minWidth: 140 }}
          >
            {t('common.back')}
          </Button>
        )}
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={() => { if (isVerified) { onNext(); } else { handleContinue(); } }}
          disabled={isVerified ? (updating || creating) : ((walletUrl ? !isValidUrl : false) || updating || creating)}
          sx={{ flex: isVerified ? '1 0 100%' : 1, minWidth: 140, width: isVerified ? '100%' : undefined }}
        >
          {updating || creating ? (
            <>
              <CircularProgress size={18} sx={{ mr: 1 }} /> {t('common.loading')}
            </>
          ) : t('common.continue')}
        </Button>
      </Box>

      {/* Fallback text intentionally removed per requirement */}

      <RightSidebar
        open={drawerOpen}
        onClose={(_, __) => setDrawerOpen(false)}
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
StepFour.displayName = 'StepFour';

const Onboarding: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  // Set to true locally during development when you need to jump between steps for debugging
  const showStepDebugControls = false;
  const {
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
  } = useOnboardingForm();

  const { data: sectorsRes, isLoading: sectorsLoading } = useSectors();
  const sectors = sectorsRes?.sectors ?? [];

  // Gating for protected steps after success
  const { data: organisationResponse, isLoading: orgLoading } = useGetOrganisation();
  const organisation = organisationResponse?.organisation;
  const orgId = organisation?.id || 'current';
  const { data: orgIdentity, isLoading: idLoading } = useGetOrgIdentity(orgId);
  const isVerified = React.useMemo(() => Boolean(orgIdentity?.verified || (orgIdentity as any)?.organisationalIdentity?.verified), [orgIdentity]);
  const missingWallet = React.useMemo(() => !organisation?.verificationRequestURLPrefix, [organisation?.verificationRequestURLPrefix]);
  const cocSigned = React.useMemo(() => Boolean(organisation?.codeOfConduct), [organisation?.codeOfConduct]);
  // Logged-in users should only see protected steps (4/5)
  const isProtectedMode = Boolean(organisation);
  const canSkipStepOne = Boolean(organisation);

  // Avoid routing from within onboarding to reduce URL jumping; AppLayout handles redirects.

  // When authenticated (organisation loaded), force onboarding to show only protected steps (4/5)
  React.useEffect(() => {
    if (orgLoading || idLoading) return;
    if (!organisation) return; // unauthenticated flow uses steps 1-3
    // Decide which protected step to show
    if (!cocSigned) {
      if (missingWallet || !isVerified) {
        goToStepFourNav();
      } else {
        goToStepFiveNav();
      }
    } else {
      if (missingWallet || !isVerified) {
        goToStepFourNav();
      } else {
        goToStepFiveNav();
      }
    }
  }, [orgLoading, idLoading, organisation, cocSigned, missingWallet, isVerified, isProtectedMode, goToStepFourNav, goToStepFiveNav]);

  return (
    <Box className="loginWrapper">
      <Box className="loginContainer">
        {/* Onboarding page header (title + optional subtitle). Hidden on step 3 (post-register success screen). */}
        {currentStep !== 3 && (
          <Box sx={{ mt: '1rem', mb: '1.5rem', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700}>{t('onboarding.title')}</Typography>
            {(() => {
              let subtitleKey: string | null = null;
              if (currentStep === 1) subtitleKey = 'onboarding.stepSubtitles.step1';
              else if (currentStep === 2) subtitleKey = 'onboarding.stepSubtitles.step2';
              else if (currentStep === 4) subtitleKey = 'onboarding.stepSubtitles.step3';
              else if (currentStep === 5) subtitleKey = 'onboarding.stepSubtitles.step4';

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
        )}

        {showStepDebugControls && process.env.NODE_ENV !== 'production' && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
            <Button size="small" variant="outlined" onClick={() => goToStepOne()} disabled={currentStep === 1}>Step 1</Button>
            <Button size="small" variant="outlined" onClick={() => goToStepTwoNav()} disabled={currentStep === 2}>Step 2</Button>
            <Button size="small" variant="outlined" onClick={() => goToStepThreeNav()} disabled={currentStep === 3}>Step 3</Button>
            <Button size="small" variant="outlined" onClick={() => { if (typeof goToStepFourNav === 'function') goToStepFourNav(); }} disabled={currentStep === 4}>Protected</Button>
            <Button size="small" variant="outlined" onClick={() => { if (typeof goToStepFiveNav === 'function') goToStepFiveNav(); }} disabled={currentStep === 5}>Code of Conduct</Button>
          </Box>
        )}

        {
          // If authenticated (organisation present), never show steps 1-3.
          isProtectedMode ? (
            (orgLoading || idLoading) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                <CircularProgress size={24} aria-label="Loading onboarding step" />
              </Box>
            ) : currentStep === 4 ? (
              <StepFour t={t} onBack={goToStepThreeNav} organisation={organisation} orgIdentity={orgIdentity} onNext={goToStepFiveNav} />
            ) : (
              <StepFive t={t} />
            )
          ) : (
            // Unauthenticated: show registration steps 1-3 normally. If user has progressed to step >= 4 (after silent login),
            // show a loading state while authenticated data loads, then the authenticated branch will render Step 4/5.
            currentStep === 1 ? (
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
            ) : currentStep === 2 ? (
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
            ) : (
              <StepThree t={t} onBack={goToStepTwoNav} onContinue={autoLogin} isSubmitting={isLoggingIn} />
            )
          )
        }

        {currentStep === 1 && (
          <Box sx={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Button
              type={canSkipStepOne ? 'button' : 'submit'}
              form={canSkipStepOne ? undefined : STEP_ONE_FORM_ID}
              onClick={canSkipStepOne ? goToStepTwoNav : undefined}
              variant="outlined"
              className="delete-btn"
              disabled={!canSkipStepOne && !isStepOneValid}
              sx={{ maxWidth: 350, width: '100%' }}
            >
              {t('common.continue')}
            </Button>
          </Box>
        )}

        {currentStep <= 2 && (
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <Box className="text-field" sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            name="userName"
            type="text"
            value={userName}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.userName')}
            fullWidth
            error={Boolean(isInvalid.userName)}
            helperText={isInvalid.userName ? t('signup.required') : ''}
            inputProps={{ maxLength: MAX_SHORT }}
            autoComplete="name"
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            name="email"
            type="email"
            value={email}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.userId')}
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
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.confirmPassword')}
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
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            name="password"
            type="password"
            value={password}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('login.password')}
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
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <Box className="text-field" sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            name="organisationName"
            type="text"
            value={organisationName}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.organisationName')}
            fullWidth
            inputProps={{ maxLength: MAX_SHORT }}
            error={showErrors && !organisationName}
            helperText={showErrors && !organisationName ? t('signup.required') : ''}
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            name="organisationDescription"
            multiline
            minRows={1}
            maxRows={6}
            value={organisationDescription}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.description')}
            fullWidth
            inputProps={{ maxLength: MAX_DESC }}
            helperText={showErrors && !organisationDescription ? t('signup.required') : undefined}
            error={showErrors && !organisationDescription}
            sx={{
              '& .MuiInputBase-root': { alignItems: 'center', minHeight: 48, paddingTop: 0, paddingBottom: 0 },
              '& .MuiInputBase-inputMultiline': { paddingTop: 0, paddingBottom: 0, lineHeight: '1.4375em', minHeight: '1.4375em' },
            }}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            name="policyUrl"
            type="url"
            value={policyUrl}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.policyUrl')}
            fullWidth
            inputProps={{ maxLength: MAX_SHORT }}
            error={showErrors && !policyUrl}
            helperText={showErrors && !policyUrl ? t('signup.required') : ''}
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
          />
          <Divider />

          <TextField
            select
            name="sector"
            value={sector}
            onChange={(e) => onChange({ target: { name: 'sector', value: e.target.value } } as any)}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.sector')}
            fullWidth
            error={showErrors && !sector}
            helperText={showErrors && !sector ? t('signup.required') : ''}
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              {sectorsLoading ? t('common.loading') : t('signup.sector')}
            </MenuItem>
            {sectors.map((s) => (
              <MenuItem key={s.id} value={s.sectorName}>{s.sectorName}</MenuItem>
            ))}
          </TextField>
          <Divider />

          <TextField
            select
            name="location"
            value={location}
            onChange={(e) => onChange({ target: { name: 'location', value: e.target.value } } as any)}
            onKeyDown={handleKeyDown}
            variant="standard"
            placeholder={t('signup.location')}
            fullWidth
            error={showErrors && !location}
            helperText={showErrors && !location ? t('signup.required') : ''}
            sx={PLACEHOLDER_SX}
            InputProps={{ disableUnderline: true }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              {t('signup.location')}
            </MenuItem>
            {countries.map((c) => (
              <MenuItem key={c.value} value={c.label}>{c.label}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', width: '100%', maxWidth: 350 }}>
          <Button
            type="button"
            variant="outlined"
            className="delete-btn"
            onClick={onBack}
            disabled={isSubmitting}
            sx={{ flex: 1, minWidth: 140 }}
          >
            {t('common.back')}
          </Button>
          <Button
            type="submit"
            variant="outlined"
            className="delete-btn"
            disabled={!isValid || isSubmitting}
            sx={{ flex: 1, minWidth: 140 }}
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

const StepThree: React.FC<StepThreeProps> = React.memo(({ t, onBack, onContinue, isSubmitting }) => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: 480 }}>
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
        <Typography variant="body1">
          {successContent}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', width: '100%', maxWidth: 350, mt: 2 }}>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={onBack}
          disabled={isSubmitting}
          sx={{ flex: 1, minWidth: 140 }}
        >
          {t('common.back')}
        </Button>
        <Button
          type="button"
          variant="outlined"
          className="delete-btn"
          onClick={onContinue}
          disabled={isSubmitting}
          sx={{ flex: 1, minWidth: 140, position: 'relative' }}
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
StepThree.displayName = 'StepThree';

OrganisationDetailsStep.displayName = 'OrganisationDetailsStep';

export default Onboarding;