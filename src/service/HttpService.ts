import axios from "axios";
import { ENDPOINTS } from "../utils/apiEndpoints";
import { imageBlobToBase64 } from "../utils/ImageUtils";

export const httpClient = axios.create({
  baseURL: "https://api.nxd.foundation",
});

export const getAuthenticatedHeaders = () => {
  return {
    Authorization: "Bearer " + JSON.parse(localStorage.getItem("Token")),
  };
};

export const HttpService = {
  listDataDisclosureAgreements: async (
    filter: string,
    limit: number,
    offsetValue: number
  ): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient
      .get(
        ENDPOINTS.listDataDisclosureAgreements(filter, limit, offsetValue),
        config
      )
      .then((res) => {
        res.data;
        return res.data;
      });
  },
  updateDDAStatus: async (ddaId, payload): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient.put(ENDPOINTS.updateDDAStatus(ddaId), payload, config);
  },
  deleteDDA: async (dataAgreementId: any): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient.delete(ENDPOINTS.deleteDDA(dataAgreementId), config);
  },
  getAdminDetails: async (): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient.get(ENDPOINTS.getAdminDetails(), config);
  },
  getOrganisationsDetails: async (): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient.get(ENDPOINTS.getOrganisationsDetails(), config);
  },
  updateOpenApiUrl: async (payload: any): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    return httpClient.put(ENDPOINTS.updateOpenApiUrl(), payload, config);
  },
  updateOrganisationLogoImage: async (formData: any): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    const payload = formData;
    return httpClient
      .put(ENDPOINTS.getLogoImage(), payload, config)
      .then((res) => {
        return res.data.Organization;
      });
  },
  getCoverImage: async (): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
      responseType: "arraybuffer",
    };
    return httpClient.get(ENDPOINTS.getCoverImage(), config).then((res) => {
      console.log(res, "RES")
      return imageBlobToBase64(res.data);
    });
  },
  getLogoImage: async (): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
      responseType: "arraybuffer",
    };
    return httpClient.get(ENDPOINTS.getLogoImage(), config).then((res) => {
      console.log(res, "RES")
      localStorage.setItem('cachedCoverImage', imageBlobToBase64(res.data));
      return imageBlobToBase64(res.data);
    });
  },
  updateOrganisationCoverImage: async (
    formData: any
  ): Promise<any> => {
    const config: object = {
      headers: { ...getAuthenticatedHeaders() },
    };
    const payload = formData;
    return httpClient
      .put(ENDPOINTS.getCoverImage(), payload, config)
      .then((res) => {
        return res.data.Organization;
      });
  },
};
