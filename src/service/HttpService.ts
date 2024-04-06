import axios from "axios";
import { ENDPOINTS } from "../utils/apiEndpoints";

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
};
