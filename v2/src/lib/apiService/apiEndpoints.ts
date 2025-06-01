
export const ENDPOINTS = {
    login: () => {
        return "/onboard/login/";
    },
    logout: () => { return "/onboard/logout" },
    refreshToken: () => {
        return "/onboard/token/refresh";
    },
    getAdminDetails: () => {
        return "/config/admin/";
    },

    dataSourceList: () => {
        return "/service/data-sources/"
    },
    // api for getting start page
    gettingStart: () => {
        return "/config/data-source/"
    },

    getLogoImage: () => {
        return "/config/data-source/logoimage/"
    },

    getCoverImage: () => {
        return "/config/data-source/coverimage/"
    },

    listConnections: (limit: number, offsetValue: number) => {
        return `/config/connections/?limit=${limit}&offset=${offsetValue}`
    },

    createConnection: () => {
        return "/config/connection/"
    },

    deleteConnection: (connectionId: string) => {
        return `/config/connection/${connectionId}/`
    },

    verificationTemplate: () => {
        return "/config/verification/templates"
    },
    verification: () => {
        return "/config/data-source/verification/"
    },
    listDataDisclosureAgreements: (filter: any, limit: number, offsetValue: number) => {
        return `config/data-disclosure-agreements/?limit=${limit}&offset=${offsetValue}${filter === "listed" ? `&status=${filter}` : ""}`;
    },
    updateDDAStatus: (id: any) => {
        return `config/data-disclosure-agreement/${id}/status/`
    },
    deleteDDA: (id: any) => {
        return `config/data-disclosure-agreement/${id}`
    },
    getOrganisationsDetails: () => {
        return "/config/data-source/";
    },
    updateOpenApiUrl: () => {
        return "/config/open-api/url";
    },
    passwordReset: () => {
        return "/config/admin/reset-password/"
    }
};
