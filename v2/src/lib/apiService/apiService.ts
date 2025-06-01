import { api } from "./api";
import { ENDPOINTS } from "./apiEndpoints";
import { axiosInstanceWithArrayBufferResType } from "./axios";
import { imageBlobToBase64 } from "@/utils/imageUtils";

export const apiService = {
  listDataDisclosureAgreements: async (
    filter: string,
    limit: number,
    offsetValue: number
  ): Promise<any> => {
    return api.get<any>(ENDPOINTS.listDataDisclosureAgreements(filter, limit, offsetValue))
      .then(res => res.data);
  },
  updateDDAStatus: async (ddaId: string, payload: unknown): Promise<any> => {
    return api.put<any>(ENDPOINTS.updateDDAStatus(ddaId), payload)
      .then(res => res.data);
  },
  deleteDDA: async (ddaId: string): Promise<any> => {
    return api.delete<any>(ENDPOINTS.deleteDDA(ddaId))
      .then(res => res.data);
  },
  getAdminDetails: async (): Promise<any> => {
    return api.get<any>(ENDPOINTS.getAdminDetails())
      .then(res => res.data);
  },
  getOrganisationsDetails: async (): Promise<any> => {
    return api.get<any>(ENDPOINTS.getOrganisationsDetails())
      .then(res => res.data);
  },
  updateOpenApiUrl: async (payload: unknown): Promise<any> => {
    return api.put<any>(ENDPOINTS.updateOpenApiUrl(), payload)
      .then(res => res.data);
  },
  updateOrganisationLogoImage: async (formData: FormData): Promise<any> => {
    return api.put<{ Organization: any }>(ENDPOINTS.getLogoImage(), formData)
      .then(res => res.data.Organization);
  },
  getCoverImage: async (): Promise<any> => {
    return axiosInstanceWithArrayBufferResType.get(ENDPOINTS.getCoverImage()).then((res) => {
      return imageBlobToBase64(res.data);
    });
  },
  getLogoImage: async (): Promise<any> => {
    return axiosInstanceWithArrayBufferResType.get(ENDPOINTS.getLogoImage()).then((res) => {
      return imageBlobToBase64(res.data);
    });
  },
  updateOrganisationCoverImage: async (formData: FormData): Promise<any> => {
    return api.put<{ Organization: any }>(ENDPOINTS.getCoverImage(), formData)
      .then(res => res.data.Organization);
  },
};