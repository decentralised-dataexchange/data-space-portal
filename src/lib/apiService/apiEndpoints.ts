
export const ENDPOINTS = {
    login: () => {
        return "/onboard/login/";
    },
    signup: () => {
        return "/onboard/register/";
    },
    logout: () => { return "/onboard/logout/" },
    refreshToken: () => {
        return "/onboard/token/refresh";
    },
    getAdminDetails: () => {
        return "/config/admin/";
    },

    organisationList: () => {
        return "/service/organisation/";
    },
    serviceSearch: () => {
        return "/service/search";
    },
    organisationById: (id: string) => {
        return `/service/organisation/?organisationId=${id}`;
    },
    getLogoImage: () => {
        return "/config/organisation/logoimage/"
    },

    getCoverImage: () => {
        return "/config/organisation/coverimage/"
    },

    // Admin avatar image
    adminAvatarImage: () => {
        // placeholder
        return "/config/admin/avatarimage/"
    },

    // Connections endpoints removed

    // Verification endpoints
    verificationTemplates: (restrictTemplate: boolean = false) => {
        return `/config/verification/templates${restrictTemplate ? '?restrict_template=true' : ''}`;
    },
    verification: () => {
        return "/config/data-source/verification/"
    },
    createVerification: () => {
        return "/config/verification/create/"
    },
    getVerification: (verificationId: string) => {
        return `/config/verification/${verificationId}/`
    },
    getOrganizationVerification: () => {
        return "/config/organization/verification/"
    },
    organisationsDetails: () => {
        return "/config/organisation/"
    },
    // Software Statement (Organisation)
    softwareStatement: () => {
        return "/config/organisation/software-statement/";
    },
    orgIdentity: () => {
        return "/config/organisation/identity/"
    },
    listDataDisclosureAgreements: (filter: any, limit: number, offsetValue: number) => {
        return `/config/data-disclosure-agreements/?limit=${limit}&offset=${offsetValue}${filter === "listed" ? `&status=${filter}` : ""}`;
    },
    // DDA history
    getDDAHistory: (dataDisclosureAgreementId: string) => {
        // Ensure the path segment is safely URL-encoded to support IDs with ':' or '/'
        const encoded = typeof dataDisclosureAgreementId === 'string' ? encodeURIComponent(dataDisclosureAgreementId) : dataDisclosureAgreementId as any;
        return `/config/data-disclosure-agreement/${encoded}/history/`;
    },
    updateDDAStatus: (id: any) => {
        return `/config/data-disclosure-agreement/${id}/status/`
    },
    updateDDATags: (id: string) => {
        return `/config/data-disclosure-agreement/${id}/tags/`
    },
    deleteDDA: (id: any) => {
        return `/config/data-disclosure-agreement/${id}/`
    },
    // B2B Connections (Organisation)
    listB2BConnections: (limit: number, offsetValue: number) => {
        return `/config/organisation/b2b-connections/?limit=${limit}&offset=${offsetValue}`;
    },
    readB2BConnection: (b2bConnectionId: string) => {
        return `/config/organisation/b2b-connection/${b2bConnectionId}/`;
    },
    deleteB2BConnection: (b2bConnectionId: string) => {
        return `/config/organisation/b2b-connection/${b2bConnectionId}/`;
    },
    // Initiate sign/unsign for organisation DDA (auth required)
    signOrSignWithBusinessWalletInitiate: (id: string) => {
        return `/config/organisation/data-disclosure-agreement/${id}/`;
    },
    // Get sign/unsign status for organisation DDA (auth required)
    organisationDDAStatus: (id: string) => {
        return `/config/organisation/data-disclosure-agreement/${id}/status/`;
    },
    // Removed legacy data-source details endpoint
    updateOpenApiUrl: () => {
        return "/config/open-api/url";
    },
    passwordReset: () => {
        return "/config/admin/reset-password/"
    },
    // OAuth2 Clients
    getOAuth2Clients: () => {
        return "/config/organisation/oauth2-clients";
    },
    createOAuth2Client: () => {
        return "/config/organisation/oauth2-client/";
    },
    updateOAuth2Client: (clientId: string) => {
        return `/config/organisation/oauth2-client/${clientId}/`;
    },
    // Organisation OAuth2 Clients - External
    getOrganisationOAuth2ClientsExternal: () => {
        return "/config/organisation/oauth2-clients-external/";
    },
    createOrganisationOAuth2ClientExternal: () => {
        return "/config/organisation/oauth2-client-external/";
    },
    updateOrganisationOAuth2ClientExternal: (clientId: string) => {
        return `/config/organisation/oauth2-client-external/${clientId}/`;
    },
    deleteOrganisationOAuth2ClientExternal: (clientId: string) => {
        return `/config/organisation/oauth2-client-external/${clientId}/`;
    },
    // Signed Agreements (Organisation)
    listSignedAgreements: (limit: number, offsetValue: number) => {
        return `/config/organisation/data-disclosure-agreement-records/?limit=${limit}&offset=${offsetValue}`;
    },
    readSignedAgreement: (id: string) => {
        return `/config/organisation/data-disclosure-agreement-record/${id}/`;
    },
    // Onboarding: Code of Conduct
    codeOfConductPdf: () => {
        return "/onboard/code-of-conduct/";
    },
    signCodeOfConduct: () => {
        return "/config/organisation/code-of-conduct";
    }
};
