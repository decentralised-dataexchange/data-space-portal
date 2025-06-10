import { api } from "./api";
import { ENDPOINTS } from "./apiEndpoints";
import { axiosInstanceWithArrayBufferResType } from "./axios";
import { imageBlobToBase64 } from "@/utils/imageUtils";
import { DataSourceListResponse } from "@/types/dataDisclosureAgreement";

interface LoginResponse {
  access: string;
  refresh: string;
}

export const apiService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>(ENDPOINTS.login(), { email, password })
      .then(res => res.data);
  },
  dataSourceList: async (): Promise<DataSourceListResponse> => {
    return api.get<DataSourceListResponse>(ENDPOINTS.dataSourceList())
      .then(res => res.data);
  },
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
  // list connections for organisation
  listConnections: async (limit: number, offsetValue: number, restrictTemplate: boolean = false): Promise<any> => {
    return api.get<any>(ENDPOINTS.listConnections(limit, offsetValue))
      .then(res => res.data);
  },
  updateOrganisationCoverImage: async (formData: FormData): Promise<any> => {
    return api.put<{ Organization: any }>(ENDPOINTS.getCoverImage(), formData)
      .then(res => res.data.Organization);
  },
  // Methods for getLogoImage and updateOrganisationLogoImage already exist above
  // Getting Started endpoints
  getGettingStartData: async (): Promise<any> => {
    console.log('DEBUG API: Calling getGettingStartData endpoint', ENDPOINTS.gettingStart());
    try {
      const response = await api.get<any>(ENDPOINTS.gettingStart());
      console.log('DEBUG API: getGettingStartData response status:', response.status);
      console.log('DEBUG API: getGettingStartData response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('DEBUG API: Error in getGettingStartData:', error?.message, error?.response?.status, error?.response?.data);
      throw error;
    }
  },
  updateDataSource: async (payload: unknown): Promise<any> => {
    return api.put<any>(ENDPOINTS.gettingStart(), payload)
      .then(res => res.data)
      .catch(error => {
        throw error;
      });
  },
  getVerificationTemplate: async (restrictTemplate: boolean = false): Promise<any> => {
    try {
      // Following the reference app pattern, we only fetch the template if restrictTemplate is false
      if (restrictTemplate) {
        return null;
      }
      const url = ENDPOINTS.verificationTemplate();
      const response = await api.get<any>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createVerification: async (): Promise<any> => {
    try {
      const response = await api.post<any>(ENDPOINTS.verification(), {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getVerification: async (): Promise<any> => {
    try {
      const response = await api.get<any>(ENDPOINTS.verification());
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};