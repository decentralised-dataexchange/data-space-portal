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
import { v4 as uuidv4 } from 'uuid';

// Mock data store - keeping only for reference, not used in production
const mockDataStore = {
  organization: {
    id: 'org-123',
    name: 'Demo Organization',
    isVerified: false,
    verification: {
      id: null as string | null,
      status: 'not_started' as const,
      attempts: 0
    }
  },
  verificationTemplates: [
    {
      id: 'template-1',
      name: 'Business Registration',
      description: 'Verify your business registration details',
      issuerId: 'issuer-1',
      issuerName: 'Business Registry Authority',
      issuerLocation: 'Finland',
      issuerLogoUrl: '/images/business-registry-logo.png',
      walletName: 'Business Wallet',
      walletLocation: 'Finland',
      available: true,
      requiredFields: ['businessName', 'registrationNumber', 'country']
    }
  ] as VerificationTemplate[],
  verifications: {} as Record<string, Verification>
};

// Helper function to simulate API delay
const simulateApiCall = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

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
  // Verification template endpoints
  getVerificationTemplates: async (restrictTemplate: boolean = false) => {
    type ResponseData = { verificationTemplates: VerificationTemplate[] };
    
    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock verification templates');
      return {
        verificationTemplates: [
          {
            id: 'template-1',
            name: 'Business Verification',
            description: 'Verify your business credentials',
            issuerId: 'issuer-1',
            issuerName: 'Business Registry',
            issuerLocation: 'Finland',
            walletName: 'Business Wallet',
            walletLocation: 'Finland',
            available: true,
            requiredFields: ['businessName', 'registrationNumber'],
            issuerLogoUrl: '/images/business-registry-logo.png'
          },
          {
            id: 'template-2',
            name: 'Identity Verification',
            description: 'Verify your personal identity',
            issuerId: 'issuer-2',
            issuerName: 'National ID',
            issuerLocation: 'Finland',
            walletName: 'Personal Wallet',
            walletLocation: 'Finland',
            available: true,
            requiredFields: ['firstName', 'lastName', 'dateOfBirth'],
            issuerLogoUrl: '/images/national-id-logo.png'
          }
        ]
      };
    }
    
    // In production, make the actual API call
    try {
      const response = await api.get<ResponseData>(
        ENDPOINTS.verificationTemplates(restrictTemplate)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching verification templates:', error);
      // Return mock data as fallback even in production if API fails
      return {
        verificationTemplates: []
      };
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

  // Getting Started endpoints
  getGettingStartData: async (): Promise<any> => {
    return simulateApiCall({
      dataSource: {
        id: mockDataStore.organization.id,
        name: mockDataStore.organization.name,
        description: 'This is a demo organization for testing',
        location: 'Demo City, Demo Country',
        policyUrl: 'https://example.com/privacy-policy',
        sector: 'Technology',
        isVerified: mockDataStore.organization.isVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verification: {
          ...mockDataStore.organization.verification,
          status: mockDataStore.organization.isVerified ? 'verified' : 'not_verified'
        }
      },
      verification: mockDataStore.organization.verification.id ? 
        await apiService.getVerification(mockDataStore.organization.verification.id) : 
        null
    });
  },
  updateDataSource: async (payload: unknown): Promise<any> => {
    return api.put<any>(ENDPOINTS.gettingStart(), payload)
      .then(res => res.data)
      .catch(error => {
        throw error;
      });
  },
  getVerificationTemplate: async (restrictTemplate: boolean = false): Promise<any> => {
    if (restrictTemplate) {
      return simulateApiCall(null);
    }
    return simulateApiCall(mockDataStore.verificationTemplates[0] || null);
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