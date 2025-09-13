export interface AccessTokenClaims {
    exp: number
    iat: number
    jti: string
    iss: string
    aud: string
    sub: string
    typ: string
    azp: string
    session_state: string
    acr: string
    "allowed-origins": string[]
    realm_access: any
    resource_access: any
    scope: string
    sid: string
    email_verified: boolean
    preferred_username: string
    given_name: string
    family_name: string
    email: string
}

export interface AccessToken {
    access_token: string
    expires_in: number
    refresh_expires_in: number
    refresh_token: string
    token_type: string
}

export interface User {
    id: string
    email: string
    name: string
    avatarImageId: string
    avatarImageUrl: string
    lastVisited: string
}

export interface SignupOrganisationPayload {
    name: string
    sector: string
    location: string
    policyUrl: string
    description: string
    verificationRequestURLPrefix: string
}

export interface SignupPayload {
    organisation: SignupOrganisationPayload
    name: string // user's name
    email: string
    password: string
    confirmPassword: string
}

// --- Signup response types ---
export interface SignupUser {
  id: number;
  email: string;
  name: string;
}

export interface SignupOrganisation {
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
}

export interface SignupResponse {
  user: SignupUser;
  organisation: SignupOrganisation;
}
