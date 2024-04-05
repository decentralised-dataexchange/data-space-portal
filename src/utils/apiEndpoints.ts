
export const ENDPOINTS = {
    login: () => {
      return "/onboard/login/";
    },
    logout: () => {return "/onboard/logout"},
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
    listConnections: () => {
      return "/config/connections/"
    },

    verificationTemplate: () => {
      return "/config/verification/templates"
    },
    verification: () => {
      return "/config/data-source/verification/"
    },
    listDataDisclosureAgreements: (filter: any, limit:number, offsetValue:number) => {
      return `config/data-disclosure-agreements/?limit=${limit}&offset=${offsetValue}${filter === "listed" ? `&status=${filter}` : ""}`;
    },
    updateDDAStatus: (id: any) => {
      return `config/data-disclosure-agreement/${id}/status/`
    },
    deleteDDA:  (id: any) => {
      return `config/data-disclosure-agreement/${id}`
    }
  };
  