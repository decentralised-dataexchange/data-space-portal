
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

    gettingStart: () => {
      return "/config/data-source/"
    }
  };
  