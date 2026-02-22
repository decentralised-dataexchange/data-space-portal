import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetOrganisation, useGetOrgIdentity } from './gettingStarted';
import { useAppSelector } from './store';

/**
 * Hook to guard protected routes from users who haven't completed onboarding.
 * Redirects to /onboarding if:
 * - User is authenticated
 * - But hasn't signed the Code of Conduct yet
 * 
 * Use this hook in protected pages to ensure users complete onboarding before accessing the app.
 */
export const useOnboardingGuard = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAppSelector(state => state.auth);
  const { data: organisationResponse, isLoading: orgLoading } = useGetOrganisation();
  const organisation = organisationResponse?.organisation;
  const orgId = organisation?.id || 'current';
  const { data: orgIdentity, isLoading: idLoading } = useGetOrgIdentity(orgId);

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) return;

    // Only check if user is authenticated
    if (!isAuthenticated) return;

    // Wait for organisation and identity data to load
    if (orgLoading || idLoading) return;

    // If no organisation data, something is wrong - let them through for now
    // (they'll hit errors from protected APIs anyway)
    if (!organisation) return;

    // Check if Code of Conduct is signed and identity is verified
    const cocSigned = Boolean(organisation?.codeOfConduct);
    const isVerified = Boolean((orgIdentity as any)?.verified || (orgIdentity as any)?.organisationalIdentity?.verified);

    // If CoC is not signed or identity not verified, redirect to onboarding
    if (!cocSigned || !isVerified) {
      router.push('/onboarding');
    }
  }, [authLoading, isAuthenticated, orgLoading, idLoading, organisation, orgIdentity, router]);

  const cocSigned = Boolean(organisation?.codeOfConduct);
  const isVerified = Boolean((orgIdentity as any)?.verified || (orgIdentity as any)?.organisationalIdentity?.verified);

  // Return loading state so components can show spinner if needed
  return {
    isCheckingOnboarding: authLoading || orgLoading || idLoading,
    onboardingComplete: cocSigned && isVerified,
  };
};
