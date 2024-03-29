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