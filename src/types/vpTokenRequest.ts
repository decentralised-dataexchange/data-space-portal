export interface ClientMetadata {
  client_name: string;
  logo_uri?: string;
  location?: string;
  cover_uri?: string;
  description?: string;
  legal_pid_attestation?: string;
  legal_pid_attestation_pop?: string;
}

export interface VpTokenRequestPayload {
  state: string;
  client_id: string;
  response_type: string;
  response_mode: string;
  scope: string;
  nonce: string;
  iss: string;
  aud: string;
  exp: number;
  client_metadata: ClientMetadata;
  dcql_query?: any;
  response_uri?: string;
}
