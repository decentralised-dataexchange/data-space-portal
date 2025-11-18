import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import { useOnboardingSignup, useSilentLogin } from '@/custom-hooks/onboarding';
import type { SignupPayload } from '@/types/auth';

export const MAX_SHORT = 100;
export const MAX_DESC = 500;
export const PASSWORD_MAX = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SECTOR_OPTIONS = [
  { value: 'healthcare', labelKey: 'onboarding.sectors.healthcare' },
  { value: 'research', labelKey: 'onboarding.sectors.research' },
  { value: 'government', labelKey: 'onboarding.sectors.government' },
  { value: 'nonProfit', labelKey: 'onboarding.sectors.nonProfit' },
  { value: 'private', labelKey: 'onboarding.sectors.private' },
];

export interface OnboardingAdminFields {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OnboardingOrganisationFields {
  organisationName: string;
  organisationDescription: string;
  policyUrl: string;
  sector: string;
  location: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const INITIAL_ADMIN_FIELDS: OnboardingAdminFields = {
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const INITIAL_ORGANISATION_FIELDS: OnboardingOrganisationFields = {
  organisationName: '',
  organisationDescription: '',
  policyUrl: '',
  sector: '',
  location: '',
};

const ADMIN_FIELD_NAMES = Object.keys(INITIAL_ADMIN_FIELDS) as Array<keyof OnboardingAdminFields>;
const ORGANISATION_FIELD_NAMES = Object.keys(INITIAL_ORGANISATION_FIELDS) as Array<keyof OnboardingOrganisationFields>;

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [adminCredentials, setAdminCredentials] = useState<OnboardingAdminFields>(INITIAL_ADMIN_FIELDS);
  const [organisationDetails, setOrganisationDetails] = useState<OnboardingOrganisationFields>(INITIAL_ORGANISATION_FIELDS);
  const [showErrors, setShowErrors] = useState({ step1: false, step2: false });
  const { mutate: triggerSilentLogin, isPending: isLoggingIn } = useSilentLogin();
  const { mutate: triggerRegister, isPending: isRegistering } = useOnboardingSignup();
  const autoLoginPendingRef = useRef(false);

  const emailInvalid = useMemo(
    () => adminCredentials.email.length > 0 && !EMAIL_REGEX.test(adminCredentials.email),
    [adminCredentials.email],
  );

  const passwordLengthInvalid = useMemo(
    () =>
      adminCredentials.password.length > 0 &&
      (adminCredentials.password.length < 8 || adminCredentials.password.length > PASSWORD_MAX),
    [adminCredentials.password],
  );

  const passwordsMismatch = useMemo(
    () =>
      adminCredentials.confirmPassword.length > 0 &&
      adminCredentials.password !== adminCredentials.confirmPassword,
    [adminCredentials.confirmPassword, adminCredentials.password],
  );

  const isStepOneValid = useMemo(
    () =>
      Boolean(
        adminCredentials.userName &&
          adminCredentials.email &&
          adminCredentials.password &&
          adminCredentials.confirmPassword,
      ) && !emailInvalid && !passwordLengthInvalid && !passwordsMismatch,
    [adminCredentials, emailInvalid, passwordLengthInvalid, passwordsMismatch],
  );

  const isStepTwoValid = useMemo(
    () =>
      Boolean(
        organisationDetails.organisationName &&
          organisationDetails.organisationDescription &&
          organisationDetails.policyUrl &&
          organisationDetails.sector &&
          organisationDetails.location,
      ),
    [organisationDetails],
  );

  const updateField = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target as HTMLInputElement;

      if (ADMIN_FIELD_NAMES.includes(name as keyof OnboardingAdminFields)) {
        setAdminCredentials((prev) => ({ ...prev, [name]: value }));
        return;
      }

      if (ORGANISATION_FIELD_NAMES.includes(name as keyof OnboardingOrganisationFields)) {
        setOrganisationDetails((prev) => ({ ...prev, [name]: value }));
      }
    },
    [],
  );

  const goToStepTwo = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isStepOneValid) {
        setShowErrors((prev) => ({ ...prev, step1: true }));
        return;
      }

      setShowErrors((prev) => ({ ...prev, step1: false }));
      setCurrentStep(2);
    },
    [isStepOneValid],
  );

  const goToStepOne = useCallback(() => {
    autoLoginPendingRef.current = false;
    setCurrentStep(1);
    setShowErrors((prev) => ({ ...prev, step2: false }));
  }, []);

  const goToStepTwoNav = useCallback(() => {
    autoLoginPendingRef.current = false;
    setCurrentStep(2);
  }, []);

  const goToStepThreeNav = useCallback(() => {
    autoLoginPendingRef.current = false;
    setCurrentStep(3);
  }, []);

  const goToStepFourNav = useCallback(() => {
    autoLoginPendingRef.current = false;
    setCurrentStep(4);
  }, []);

  const goToStepFiveNav = useCallback(() => {
    autoLoginPendingRef.current = false;
    setCurrentStep(5);
  }, []);

  const submitOrganisationDetails = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isStepTwoValid) {
        setShowErrors((prev) => ({ ...prev, step2: true }));
        return;
      }

      setShowErrors((prev) => ({ ...prev, step2: false }));

      const payload: SignupPayload = {
        organisation: {
          name: organisationDetails.organisationName,
          sector: organisationDetails.sector,
          location: organisationDetails.location,
          policyUrl: organisationDetails.policyUrl,
          description: organisationDetails.organisationDescription,
        },
        name: adminCredentials.userName,
        email: adminCredentials.email,
        password: adminCredentials.password,
        confirmPassword: adminCredentials.confirmPassword,
      };

      // Trigger signup and move to step 3 on success
      triggerRegister(payload, {
        onSuccess: () => setCurrentStep(3),
      });
    },
    [adminCredentials, isStepTwoValid, organisationDetails, triggerRegister],
  );

  const autoLogin = useCallback(() => {
    autoLoginPendingRef.current = true;
    triggerSilentLogin(
      { email: adminCredentials.email, password: adminCredentials.password },
      {
        onSuccess: () => {
          if (!autoLoginPendingRef.current) return;
          autoLoginPendingRef.current = false;
          setCurrentStep(4);
        },
        onError: () => {
          autoLoginPendingRef.current = false;
        },
        onSettled: () => {
          autoLoginPendingRef.current = false;
        },
      }
    );
  }, [adminCredentials.email, adminCredentials.password, triggerSilentLogin]);

  return {
    currentStep,
    adminCredentials,
    organisationDetails,
    showErrors,
    emailInvalid,
    passwordLengthInvalid,
    passwordsMismatch,
    isStepOneValid,
    isStepTwoValid,
    updateField,
    goToStepTwo,
    goToStepOne,
    goToStepTwoNav,
    goToStepThreeNav,
    goToStepFourNav,
    goToStepFiveNav,
    submitOrganisationDetails,
    isRegistering,
    isLoggingIn,
    autoLogin,
  };
};
