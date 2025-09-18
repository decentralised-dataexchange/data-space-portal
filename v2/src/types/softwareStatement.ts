export type SoftwareStatementStatus = '' | 'offer_sent' | 'offer_received' | 'credential_accepted';

export interface SoftwareStatementRecord {
  // Keep flexible to allow backend changes without breaking the UI
  id?: string;
  dataAgreementId?: string;
  isAccessed?: boolean;
  dataAttributeValues?: unknown[];
  issuanceMode?: string;
  isPreAuthorised?: boolean;
  credentialOffer?: string;
  credentialStatus?: string;
  issuerState?: string;
  authorisationRequestState?: string;
  idTokenRequestState?: string;
  idTokenRequest?: string;
  authorisationCodeState?: string;
  status?: string;
  clientId?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  redirectUri?: string;
  acceptanceToken?: string;
  authorisationCode?: string;
  preAuthorisedCode?: string;
  userPin?: string;
  createdAt?: number;
  updatedAt?: number;
  did?: string;
  openIdOrganisationId?: string;
  CredentialExchangeId?: string;
  limitedDisclosure?: boolean;
  credential?: {
    claims?: Record<string, unknown> & { client_uri?: string };
    vct?: string;
    [key: string]: unknown;
  };
  disclosureMapping?: Record<string, unknown>;
  credentialLabel?: string;
  credentialDefinitionId?: string;
  presentationDefinitionId?: string;
  presentationExchangeId?: string;
  credentialOfferEndpoint?: string;
  holder?: { name?: string };
  credentialDefinitionUri?: string;
  credentialFormat?: string;
  supportRevocation?: boolean;
  revocationStatus?: string;
  clientAssertion?: string;
  clientAssertionType?: string;
  clientAssertionVerified?: boolean;
  walletUnitAttestation?: string;
  walletUnitAttestationPoP?: string;
  walletUnitAttestationVerified?: boolean;
  credentialToken?: string;
  cnf?: Record<string, unknown>;
  jti?: string;
  proof?: string;
  proofType?: string;
  proofVerified?: boolean;
  decodedWalletUnitAttestation?: Record<string, unknown>;
  idToken?: string;
  idTokenDecoded?: Record<string, unknown>;
  idTokenVerified?: boolean;
  issuanceDeniedReason?: string;
  expiredCredentialTokens?: unknown[];
  expiredCredentials?: unknown[];
  isTokenAccessed?: boolean;
  credentialResponseEncryption?: Record<string, unknown>;
  isVerifiedWithTrustList?: boolean;
  trustServiceProvider?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SoftwareStatementResponse {
  softwareStatement: SoftwareStatementRecord | Record<string, never>;
  organisationId: string;
  credentialExchangeId: string;
  status: SoftwareStatementStatus;
}
