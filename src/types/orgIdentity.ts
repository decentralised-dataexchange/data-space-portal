export interface OrganisationalIdentityHolder {
  name: string;
}

// Presentation item as seen in verified=true sample
export interface PresentationStatusList {
  idx: number;
  uri: string;
}

export interface PresentationStatus {
  status_list?: PresentationStatusList;
  // Allow arbitrary extra fields from backend
  [key: string]: unknown;
}

export interface PresentationKb {
  aud?: string;
  iat?: number;
  nonce?: string;
  sd_hash?: string;
  [key: string]: unknown;
}

export interface PresentationCnfJwk {
  x?: string;
  y?: string;
  crv?: string;
  kty?: string;
  [key: string]: unknown;
}

export interface PresentationCnf {
  jwk?: PresentationCnfJwk;
  [key: string]: unknown;
}

export interface PresentationItem {
  kb?: PresentationKb;
  cnf?: PresentationCnf;
  exp?: number;
  iat?: number;
  iss?: string;
  jti?: string;
  nbf?: number;
  sub?: string;
  vct?: string;
  status?: PresentationStatus;
  legalName?: string;
  identifier?: string;
  // Allow additional keys in case backend adds more
  [key: string]: unknown;
}

export interface WalletAttestationFlags {
  isExpired: boolean;
  isRevoked?: boolean;
  isVerified: boolean;
}

export interface WalletUnitValidityItem {
  attestation?: WalletAttestationFlags;
  validatedAt?: number;
  proofOfPossession?: WalletAttestationFlags;
  [key: string]: unknown;
}

export interface PresentationValidityItem {
  validatedAt?: number;
  // The key like "Presentation Definition 1" maps to a complex object. Keep it generic.
  [definitionLabel: string]: unknown;
}

export interface OrganisationalIdentity {
  id: string;
  nonce: string;
  holder: OrganisationalIdentityHolder;
  status: string;
  idToken: string;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  presentation: PresentationItem[] | null;
  responseMode: string;
  responseType: string;
  vpTokenQrCode: string;
  clientIdScheme: string;
  idTokenDecoded: Record<string, unknown>;
  vpTokenRequest: string;
  transactionData: unknown | null;
  vpTokenResponse: string[] | null;
  requiresEncryption: boolean;
  walletUnitValidity: WalletUnitValidityItem[];
  verifierAttestation: string;
  vpTokenRequestState: string;
  credentialExchangeId: string;
  openIdOrganisationId: string;
  presentationValidity: PresentationValidityItem[];
  directPostRedirectUri: string;
  transactionDataBase64: string;
  walletUnitAttestation: string;
  presentationExchangeId: string;
  presentationSubmission: unknown | null;
  presentationDefinitionId: string;
  walletUnitAttestationPoP: string;
  walletUnitAttestationVerified: boolean;
}

// Allow the backend to return an empty object when identity hasn't been created
export type EmptyObject = Record<string, never>;
export type OrganisationalIdentityOrEmpty = OrganisationalIdentity | EmptyObject;

export interface OrgIdentityResponse {
  organisationalIdentity: OrganisationalIdentityOrEmpty;
  organisationId: string;
  presentationExchangeId: string;
  state: string;
  verified: boolean;
}
