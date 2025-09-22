import { Pagination as DDAPagination } from './dataDisclosureAgreement';

export interface DDARecordDataAttribute {
  id?: string;
  name?: string;
  attributeName?: string;
  category?: string;
  description?: string;
  sensitivity?: boolean;
}

export interface DDARecordDataController {
  did?: string;
  url?: string;
  name?: string;
  legalId?: string;
  industrySector?: string;
  publicKey?: string;
}

export interface DataDisclosureAgreementRecordJSON {
  '@id'?: string;
  '@type'?: string[];
  '@context'?: string[];
  templateVersion?: string;
  dataAgreementId?: string;
  dataAgreementRevisionId?: string;
  dataAgreementRevisionHash?: string;
  dataAttributes?: DDARecordDataAttribute[];

  purpose?: string;
  version?: string;
  language?: string;
  lawfulBasis?: string;
  personalData?: Array<{ attributeId?: string; attributeName?: string; attributeDescription?: string }>;
  codeOfConduct?: string;
  dataController?: DDARecordDataController;
  agreementPeriod?: number;
  purposeDescription?: string;
  dataSharingRestrictions?: any;
  createdAt?: string;
  updatedAt?: string;
}

// New nested structures for Signed Agreement Record as returned by backend
export interface DDARecordTemplateRevision {
  id: string;
  schemaName: string;
  objectId: string;
  signedWithoutObjectId: boolean;
  timestamp: string;
  authorizedByIndividualId: string;
  authorizedByOther: string;
  predecessorHash: string;
  predecessorSignature: string;
  objectData: string; // JSON string for DataDisclosureAgreementRecordJSON
  successorId: string;
  serializedHash: string;
  serializedSnapshot: string; // JSON string
}

export interface DDASignature {
  id: string;
  payload: string;
  signature: string;
  verificationMethod: string;
  verificationPayload: string;
  verificationPayloadHash: string;
  verificationArtifact: string;
  verificationSignedBy: string;
  verificationSignedAs: string;
  verificationJwsHeader: string;
  timestamp: string;
  signedWithoutObjectReference: boolean;
  objectType: string;
  objectReference: string;
}

export interface DataDisclosureAgreementRecord {
  canonicalId: string;
  dataDisclosureAgreementTemplateRevision: DDARecordTemplateRevision;
  dataSourceSignature: DDASignature;
  dataUsingServiceSignature: DDASignature;
  optIn: boolean;
  timestamp: string;
}

export interface SignedAgreementRecord {
  id: string;
  state: 'unsigned' | 'signed';
  organisationId: string; // serializer returns FK id
  dataDisclosureAgreementRecord: DataDisclosureAgreementRecord;
  dataDisclosureAgreementTemplateId: string;
  dataDisclosureAgreementTemplateRevisionId: string;
  dataDisclosureAgreementRecordId: string;
  optIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignedAgreementsListResponse {
  dataDisclosureAgreementRecord: SignedAgreementRecord[];
  pagination: Omit<DDAPagination, 'total' | 'offset'> & {
    total?: number;
    offset?: number;
  };
}

export interface SignedAgreementRecordResponse {
  dataDisclosureAgreementRecord: SignedAgreementRecord;
}

