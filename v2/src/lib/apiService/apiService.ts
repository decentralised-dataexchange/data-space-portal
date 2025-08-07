import { api } from "./api";
import { ENDPOINTS } from "./apiEndpoints";
import { axiosInstanceWithArrayBufferResType } from "./axios";
import { imageBlobToBase64 } from "@/utils/imageUtils";
import { DataSourceListResponse } from "@/types/dataDisclosureAgreement";
import { 
  Verification, 
  VerificationTemplate, 
  OrganizationVerificationResponse,
  PresentationRecord 
} from "@/types/verification";

// API Service implementation with real API calls
export const apiService = {
  login: async (email: string, password: string): Promise<{ access: string; refresh: string }> => {
    return api.post<{ access: string; refresh: string }>(
      ENDPOINTS.login(), 
      { email, password }
    ).then(res => res.data);
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
  updateLogoImage: async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('orgimage', file);
      
      // Create headers with the correct content type for file upload
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      
      // Make the API call; backend returns updated organization object, but we
      // don’t need it here – calling code can rely on its local base64 copy.
      await api.put(
        ENDPOINTS.getLogoImage(),
        formData,
        { headers }
      );
    } catch (error) {
      console.error('Error updating logo image:', error);
      throw error;
    }
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
  listConnections: async (limit: number, offsetValue: number, restrictTemplate: boolean = false): Promise<any> => {
    return api.get<any>(ENDPOINTS.listConnections(limit, offsetValue))
      .then(res => res.data);
  },
  updateOrganisationCoverImage: async (formData: FormData): Promise<any> => {
    return api.put<{ Organization: any }>(ENDPOINTS.getCoverImage(), formData)
      .then(res => res.data.Organization);
  },
  getVerificationTemplates: async (restrictTemplate: boolean = false): Promise<VerificationTemplate[]> => {
    try {
      const response = await api.get(ENDPOINTS.verificationTemplates(restrictTemplate)) as 
        { data: { verificationTemplates: VerificationTemplate[] } };
      return response.data.verificationTemplates;
    } catch (error) {
      console.error('Error fetching verification templates:', error);
      throw error;
    }
  },
  getVerificationTemplate: async (templateId: string): Promise<VerificationTemplate> => {
    try {
      // Use the endpoint from apiEndpoints and append the template ID
      const response = await api.get<VerificationTemplate>(
        `${ENDPOINTS.verificationTemplates()}/${templateId}/`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching verification template ${templateId}:`, error);
      throw error;
    }
  },
  createVerification: async (templateId: string): Promise<Verification> => {
    try {
      const response = await api.post<Verification>(
        ENDPOINTS.createVerification(), 
        { template_id: templateId }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating verification:', error);
      throw error;
    }
  },
  getVerification: async (verificationId: string): Promise<Verification> => {
    try {
      const response = await api.get<Verification>(
        ENDPOINTS.getVerification(verificationId)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching verification:', error);
      throw error;
    }
  },
  getOrganizationVerification: async (): Promise<OrganizationVerificationResponse> => {
    try {
      const response = await api.get<OrganizationVerificationResponse>(
        ENDPOINTS.getOrganizationVerification()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching organization verification:', error);
      throw error;
    }
  },
  getGettingStartData: async (): Promise<any> => {
    try {
      const response = await api.get(ENDPOINTS.gettingStart());
      return response.data;
    } catch (error) {
      console.error('Error fetching getting started data:', error);
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

  // Admin profile management
  updateAdminDetails: async (payload: { name: string }): Promise<any> => {
    return api.put<any>(ENDPOINTS.getAdminDetails(), payload)
      .then(res => res.data)
      .catch(error => {
        throw error;
      });
  },
  
  // Password reset
  passwordReset: async (payload: { old_password: string, new_password1: string, new_password2: string }): Promise<any> => {
    return api.post<any>(ENDPOINTS.passwordReset(), payload)
      .then(res => res.data)
      .catch(error => {
        throw error;
      });
  },
};
