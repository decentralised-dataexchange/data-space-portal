import React from 'react';
import { useRouter } from 'next/navigation';
import { useSectors } from '@/custom-hooks/onboarding';
import { useGetOrganisation, useGetOrgIdentity } from '@/custom-hooks/gettingStarted';
import { useOnboardingForm } from './useOnboardingForm';
import { useAppSelector } from '@/custom-hooks/store';

export type DerivedStep = 1 | 2 | 3 | 4 | 5;

export const useOnboarding = () => {
  const router = useRouter();

  // Core onboarding form state and actions
  const form = useOnboardingForm();

  // Get auth state - wait for auth check to complete before showing content
  const { loading: authLoading, isAuthenticated } = useAppSelector(state => state.auth);

  // External datasets used by steps (sectors can be fetched without auth)
  const { data: sectorsRes, isLoading: sectorsLoading } = useSectors();
  const sectors = sectorsRes?.sectors ?? [];

  // Manual override ref used by debug step switch
  const manualStepOverrideRef = React.useRef(false);

  // Organisation gating data - only fetch when authenticated
  // These hooks already have enabled: isAuthenticated, but we also check authLoading
  const { data: organisationResponse, isLoading: orgLoading } = useGetOrganisation();
  const organisation = organisationResponse?.organisation;
  const orgId = organisation?.id || 'current';
  const { data: orgIdentity, isLoading: idLoading } = useGetOrgIdentity(orgId);

  const isVerified = React.useMemo(
    () => Boolean(orgIdentity?.verified || (orgIdentity as any)?.organisationalIdentity?.verified),
    [orgIdentity]
  );
  const missingWallet = React.useMemo(
    () => !organisation?.verificationRequestURLPrefix,
    [organisation?.verificationRequestURLPrefix]
  );
  const cocSigned = React.useMemo(
    () => Boolean(organisation?.codeOfConduct),
    [organisation?.codeOfConduct]
  );

  // Modes - only determine after auth check is complete to avoid flicker
  const isProtectedMode = !authLoading && isAuthenticated && Boolean(organisation);
  const canSkipStepOne = !authLoading && isAuthenticated && Boolean(organisation);

  // Decide which step should be displayed in header/buttons to avoid flicker
  // Wait for auth and org data to load before calculating protected mode steps
  const displayStep: DerivedStep = React.useMemo(() => {
    // If auth is still loading, default to current step to avoid flicker
    if (authLoading) return form.currentStep as DerivedStep;
    
    // For logged-in onboarding, default to Step 4 (OrgIdentitySetup). Only show Step 5 when user explicitly navigates.
    if (!manualStepOverrideRef.current && isProtectedMode && !orgLoading && !idLoading) {
      return form.currentStep === 5 ? 5 : 4;
    }
    
    return form.currentStep as DerivedStep;
  }, [authLoading, isProtectedMode, orgLoading, idLoading, form.currentStep, manualStepOverrideRef]);

  // Decide which protected step content to render (4 or 5) when not overridden
  const protectedRenderStep: 4 | 5 = (form.currentStep === 5 ? 5 : 4);
  const renderStep: DerivedStep = manualStepOverrideRef.current
    ? (form.currentStep as DerivedStep)
    : (isProtectedMode ? protectedRenderStep : (form.currentStep as DerivedStep));

  // Spinner gating - show spinner during auth check or data loading
  const shouldShowInitialSpinner = authLoading || orgLoading || (isAuthenticated && Boolean(organisation) && idLoading);
  const shouldRedirectToStart = !authLoading && isProtectedMode && !orgLoading && !idLoading && !missingWallet && isVerified && cocSigned;
  const showGlobalSpinner = shouldShowInitialSpinner || shouldRedirectToStart;

  // Redirect or set step after data is ready
  React.useEffect(() => {
    if (manualStepOverrideRef.current) return;
    // Wait for auth check to complete
    if (authLoading) return;
    // Wait for org data if authenticated
    if (isAuthenticated && (orgLoading || idLoading)) return;
    // Only redirect if authenticated with organisation
    if (!isAuthenticated || !organisation) return;

    // If both identity is verified and CoC signed, redirect to /start
    if (isVerified && cocSigned) {
      router.replace('/start');
    }
  }, [manualStepOverrideRef, authLoading, isAuthenticated, orgLoading, idLoading, organisation, isVerified, cocSigned, router]);

  return {
    // form
    ...form,
    // datasets
    sectors,
    sectorsLoading,
    // gate refs and flags
    manualStepOverrideRef,
    organisation,
    orgIdentity,
    isProtectedMode,
    canSkipStepOne,
    displayStep,
    renderStep,
    showGlobalSpinner,
    authLoading,
  } as const;
};
