export interface Organisation {
  id: string;
  coverImageUrl: string;
  logoUrl: string;
  name: string;
  sector: string;
  location: string;
  policyUrl: string;
  description: string;
  owsBaseUrl: string;
  openApiUrl: string;
}

export interface OrganisationIdentity {
  id: string;
  organisationId: string;
  presentationExchangeId: string;
  presentationState: string;
  isPresentationVerified: boolean;
  presentationRecord: Record<string, unknown>;
}

export interface OrganisationItem {
  dataDisclosureAgreements: any[];
  api: string[];
  organisation: Organisation;
  organisationIdentity: OrganisationIdentity;
}

export interface OrganisationListResponse {
  organisations: OrganisationItem[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    limit: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}
