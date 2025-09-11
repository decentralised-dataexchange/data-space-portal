export interface OAuth2Client {
  id: string;
  client_id: string;
  client_secret: string;
  name: string;
  description: string;
  organisation_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OAuth2ClientsListResponse {
  oAuth2Clients: OAuth2Client[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    limit: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface OAuth2ClientCreateResponse {
  oAuth2Client: OAuth2Client;
}
