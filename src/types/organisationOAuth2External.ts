export interface OrganisationOAuth2ExternalClient {
  id: string;
  client_id: string;
  client_secret: string;
  name: string;
  description?: string;
  organisation_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganisationOAuth2ExternalClientsListResponse {
  organisationOAuth2Client: OrganisationOAuth2ExternalClient[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    limit: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface OrganisationOAuth2ExternalClientResponse {
  organisationOAuth2Client: OrganisationOAuth2ExternalClient;
}
