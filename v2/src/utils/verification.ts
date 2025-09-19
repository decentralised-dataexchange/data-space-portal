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
    return orgVerification.verified;
  }

  // Try common locations for org identity in various payloads
  const org = source?.organisation || source?.organization || source;
  const identity: AnyRecord | undefined =
    org?.organisationIdentity || org?.organizationIdentity || source?.organisationIdentity;

  // Known flags or states that signal verification
  const flags = [
    identity?.walletUnitAttestationVerified,
    identity?.isPresentationVerified,
    identity?.walletUnitAttestation?.isVerified,
    identity?.walletUnitValidity?.[0]?.attestation?.isVerified,
    identity?.walletUnitAttestationVerified,
    identity?.isVerifiedWithTrustList,
    org?.isVerifiedWithTrustList,
    org?.verified,
    source?.verified,
    source?.trusted,
    org?.trusted,
    source?.isVerifiedWithTrustList,
    // presentation state fields (case-insensitive)
    (() => {
      const s = identity?.presentationState; return typeof s === 'string' && s.toLowerCase() === 'verified';
    })(),
    (() => {
      const s = source?.verification?.presentationState; return typeof s === 'string' && s.toLowerCase() === 'verified';
    })(),
    (() => {
      const s = org?.verification?.presentationState; return typeof s === 'string' && s.toLowerCase() === 'verified';
    })(),
  ];

  return flags.some(isTrueLike);
}

export function getTrustLabel(isVerified: boolean): 'Trusted' | 'Untrusted' {
  return isVerified ? 'Trusted' : 'Untrusted';
}
