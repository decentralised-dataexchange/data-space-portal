import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetOrganisation } from './gettingStarted';
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

  useEffect(() => {
    // Wait for auth check to complete
    if (authLoading) return;
    
    // Only check if user is authenticated
    if (!isAuthenticated) return;
    
    // Wait for organisation data to load
    if (orgLoading) return;
    
    // If no organisation data, something is wrong - let them through for now
    // (they'll hit errors from protected APIs anyway)
    if (!organisation) return;
    
    // Check if Code of Conduct is signed
    const cocSigned = Boolean(organisation?.codeOfConduct);
    
    // If CoC is not signed, redirect to onboarding
    if (!cocSigned) {
      console.log('Onboarding incomplete: redirecting to /onboarding');
      router.push('/onboarding');
    }
  }, [authLoading, isAuthenticated, orgLoading, organisation, router]);

  // Return loading state so components can show spinner if needed
  return {
    isCheckingOnboarding: authLoading || orgLoading,
    onboardingComplete: Boolean(organisation?.codeOfConduct),
  };
};
