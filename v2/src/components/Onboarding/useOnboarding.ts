import React from 'react';
import { useRouter } from 'next/navigation';
import { useSectors } from '@/custom-hooks/onboarding';
import { useGetOrganisation, useGetOrgIdentity } from '@/custom-hooks/gettingStarted';
import { useOnboardingForm } from './useOnboardingForm';

export type DerivedStep = 1 | 2 | 3 | 4 | 5;

export const useOnboarding = () => {
  const router = useRouter();

  // Core onboarding form state and actions
  const form = useOnboardingForm();

  // External datasets used by steps
  const { data: sectorsRes, isLoading: sectorsLoading } = useSectors();
  const sectors = sectorsRes?.sectors ?? [];

  // Manual override ref used by debug step switch
  const manualStepOverrideRef = React.useRef(false);

  // Organisation gating data
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

  // Modes
  const isProtectedMode = Boolean(organisation);
  const canSkipStepOne = Boolean(organisation);

  // Decide which step should be displayed in header/buttons to avoid flicker
  // For logged-in onboarding, default to Step 4 (OrgIdentitySetup). Only show Step 5 when user explicitly navigates.
  const displayStep: DerivedStep = (!manualStepOverrideRef.current && isProtectedMode && !orgLoading && !idLoading)
    ? (form.currentStep === 5 ? 5 : 4)
    : (form.currentStep as DerivedStep);

  // Decide which protected step content to render (4 or 5) when not overridden
  // Keep user on Step 4 unless they explicitly moved to Step 5
  const protectedRenderStep: 4 | 5 = (form.currentStep === 5 ? 5 : 4);
  const renderStep: DerivedStep = manualStepOverrideRef.current
    ? (form.currentStep as DerivedStep)
    : (isProtectedMode ? protectedRenderStep : (form.currentStep as DerivedStep));

  // Spinner gating
  const shouldShowInitialSpinner = orgLoading || (Boolean(organisation) && idLoading);
  const shouldRedirectToStart = isProtectedMode && !orgLoading && !idLoading && !missingWallet && isVerified && cocSigned;
  const showGlobalSpinner = shouldShowInitialSpinner || shouldRedirectToStart;

  // Redirect or set step after data is ready
  React.useEffect(() => {
    if (manualStepOverrideRef.current) return;
    if (orgLoading || idLoading) return;
    if (!organisation) return;

    // If both identity is verified and CoC signed, redirect to /start
    if (isVerified && cocSigned) {
      router.push('/start');
    }
  }, [manualStepOverrideRef, orgLoading, idLoading, organisation, isVerified, missingWallet, cocSigned, form, router]);

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
  } as const;
};
