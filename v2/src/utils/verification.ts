export type AnyRecord = Record<string, any>;

// Standardized check for whether an organisation is verified ("Trusted")
// Tries multiple possible shapes to be resilient across responses
export function isOrganisationVerified(
  source?: AnyRecord,
  orgVerification?: { verified?: boolean } | null
): boolean {
  if (!source && !orgVerification) return false;

  // If an explicit verification object is supplied, prefer that
  if (orgVerification && typeof orgVerification.verified === 'boolean') {
    return orgVerification.verified === true;
  }

  // Try common locations for org identity in various payloads
  const org = source?.organisation || source?.organization || source;
  const identity: AnyRecord | undefined =
    org?.organisationIdentity || org?.organizationIdentity || source?.organisationIdentity;

  // Known flags or states that signal verification
  const flags = [
    // Explicit boolean flags
    identity?.walletUnitAttestationVerified,
    identity?.isPresentationVerified,
    identity?.walletUnitAttestation?.isVerified,
    identity?.walletUnitValidity?.[0]?.attestation?.isVerified,
    identity?.walletUnitAttestationVerified === true,
    identity?.presentationState === 'verified',
    org?.verified === true,
    source?.verified === true,
    // Common ad-hoc fields
    source?.trusted === true,
    org?.trusted === true,
    source?.verification?.presentationState === 'verified',
    org?.verification?.presentationState === 'verified',
  ];

  return flags.some(Boolean);
}

export function getTrustLabel(isVerified: boolean): 'Trusted' | 'Untrusted' {
  return isVerified ? 'Trusted' : 'Untrusted';
}
