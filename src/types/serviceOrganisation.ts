import { DataDisclosureAgreement } from "./dataDisclosureAgreement";
import { SoftwareStatementRecord } from "./softwareStatement";

export interface ServiceOrganisationItemOrg {
  id: string;
  coverImageUrl: string;
  logoUrl: string;
  name: string;
  sector: string;
  location: string;
  policyUrl: string;
  description: string;
  verificationRequestURLPrefix: string;
  openApiUrl: string;
  // Optional endpoints used across UI
  credentialOfferEndpoint?: string | null;
  accessPointEndpoint?: string | null;
  // Public response now includes software statement under organisation
  softwareStatement?: SoftwareStatementRecord | Record<string, never>;
}

export interface ServiceOrganisationPresentationStatusList {
  idx: number;
  uri: string;
}

export interface ServiceOrganisationPresentationStatus {
  status_list?: ServiceOrganisationPresentationStatusList;
  [key: string]: unknown;
}

export interface ServiceOrganisationPresentationKb {
  aud?: string;
  iat?: number;
  nonce?: string;
  sd_hash?: string;
  [key: string]: unknown;
}

export interface ServiceOrganisationPresentationCnfJwk {
  x?: string;
  y?: string;
  crv?: string;
  kty?: string;
  [key: string]: unknown;
}

export interface ServiceOrganisationPresentationCnf {
  jwk?: ServiceOrganisationPresentationCnfJwk;
  [key: string]: unknown;
}

export interface ServiceOrganisationPresentationItem {
  kb?: ServiceOrganisationPresentationKb;
  cnf?: ServiceOrganisationPresentationCnf;
  exp?: number;
  iat?: number;
  iss?: string;
  jti?: string;
  nbf?: number;
  sub?: string;
  vct?: string;
  status?: ServiceOrganisationPresentationStatus;
  legalName?: string;
  identifier?: string;
  [key: string]: unknown;
}

export interface ServiceOrganisationPresentationRecordHolder {
  name?: string;
}

export interface ServiceOrganisationPresentationRecord {
  id: string;
  nonce: string;
  holder?: ServiceOrganisationPresentationRecordHolder;
  status: string;
  idToken: string;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  presentation: ServiceOrganisationPresentationItem[];
  responseMode: string;
  responseType: string;
  vpTokenQrCode: string;
  clientIdScheme: string;
  idTokenDecoded: Record<string, unknown>;
  vpTokenRequest: string;
  transactionData: unknown | null;
  vpTokenResponse: string[] | null;
  requiresEncryption: boolean;
  walletUnitValidity: unknown[];
  verifierAttestation: string;
  vpTokenRequestState: string;
  credentialExchangeId: string;
  openIdOrganisationId: string;
  presentationValidity: unknown[];
  directPostRedirectUri: string;
  transactionDataBase64: string;
  walletUnitAttestation: string;
  presentationExchangeId: string;
  presentationSubmission: unknown | null;
  presentationDefinitionId: string;
  walletUnitAttestationPoP: string;
  walletUnitAttestationVerified: boolean;
}

export interface ServiceOrganisationIdentity {
  id: string;
  organisationId: string;
  presentationExchangeId: string;
  presentationState: string;
  isPresentationVerified: boolean;
  presentationRecord: ServiceOrganisationPresentationRecord;
}

export interface ServiceOrganisationItem {
  dataDisclosureAgreements: DataDisclosureAgreement[];
  api: string[];
  organisation: ServiceOrganisationItemOrg;
  organisationIdentity: ServiceOrganisationIdentity;
}

export interface ServicePagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  limit: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ServiceOrganisationResponse {
  organisations: ServiceOrganisationItem[];
  pagination: ServicePagination;
}
