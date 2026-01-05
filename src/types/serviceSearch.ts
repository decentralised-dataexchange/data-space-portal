import { ServiceOrganisationItem, ServicePagination } from "./serviceOrganisation";
import type { DataDisclosureAgreementRecordJSON } from "./signedAgreement";

export type ServiceSearchSortBy =
  | "relevance"
  | "orgName"
  | "orgCreatedAt"
  | "ddaCreatedAt";

export type ServiceSearchSortOrder = "asc" | "desc";

export interface ServiceSearchParams {
  search: string;
  searchOrgName?: boolean;
  searchDdaPurpose?: boolean;
  searchDdaDescription?: boolean;
  searchDataset?: boolean;
  searchTags?: boolean;
  sortBy?: ServiceSearchSortBy;
  sortOrder?: ServiceSearchSortOrder;
  offset?: number;
  limit?: number;
}

export interface ServiceSearchDdaItem {
  tags?: string[];
  id: string;
  organisationId: string;
  organisationName: string;
  dataDisclosureAgreementRecord: DataDisclosureAgreementRecordJSON;
  status: string;
  isLatestVersion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceSearchMeta {
  query: string;
  searchOrgName: boolean;
  searchDdaPurpose: boolean;
  searchDdaDescription: boolean;
  searchDataset: boolean;
  searchTags: boolean;
  sortBy: ServiceSearchSortBy;
  sortOrder: ServiceSearchSortOrder;
}

export interface ServiceSearchResponse {
  organisations: ServiceOrganisationItem[];
  organisationsPagination: ServicePagination;
  ddas: ServiceSearchDdaItem[];
  ddasPagination: ServicePagination;
  searchMeta: ServiceSearchMeta;
}
