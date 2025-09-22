import { Pagination } from './dataDisclosureAgreement';

export interface SoftwareStatementDecoded {
  kb?: {
    aud?: string;
    iat?: number;
    nonce?: string;
    sd_hash?: string;
  };
  cnf?: {
    jwk?: {
      x?: string;
      y?: string;
      crv?: string;
      kty?: string;
    };
  };
  exp?: number;
  iat?: number;
  iss?: string;
  jti?: string;
  nbf?: number;
  sub?: string;
  vct?: string;
  status?: {
    status_list?: {
      idx?: number;
      uri?: string;
    }
  };
  client_uri?: string;
}

export interface B2BConnectionRecord {
  id: string;
  nonce: string;
  timestamp: string;
  myClientId: string;
  theirClientId: string;
  myClientSecret?: string;
  theirClientSecret?: string;
  mySoftwareStatementDecoded?: SoftwareStatementDecoded;
  theirSoftwareStatementDecoded?: SoftwareStatementDecoded;
}

export interface B2BConnectionItem {
  id: string; // wrapper id (uuid)
  b2bConnectionRecord: B2BConnectionRecord;
  b2bConnectionId: string; // repeated record id
  createdAt: string;
  updatedAt: string;
  organisationId: string;
}

export interface B2BConnectionsListResponse {
  b2bConnection: B2BConnectionItem[];
  pagination: Pagination;
}

export interface B2BConnectionDetailResponse {
  b2bConnection: B2BConnectionItem;
}
