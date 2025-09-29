import { api } from "./api";
import { ENDPOINTS } from "./apiEndpoints";
import { axiosInstanceWithArrayBufferResType } from "./axios";
import { imageBlobToBase64 } from "@/utils/imageUtils";
import { OrganisationListResponse, OrganisationResponse, OrganisationUpdatePayload } from "@/types/organisation";
import { OAuth2ClientsListResponse, OAuth2ClientCreateResponse } from "@/types/oauth2";
import { OrganisationOAuth2ExternalClientsListResponse, OrganisationOAuth2ExternalClientResponse } from "@/types/organisationOAuth2External";
import {
  Verification,
  VerificationTemplate,
  OrganizationVerificationResponse,
  PresentationRecord
} from "@/types/verification";
import { SignupPayload } from "@/types/auth";
import { OrgIdentityResponse } from "@/types/orgIdentity";
import { SoftwareStatementResponse } from "@/types/softwareStatement";
import { DDAgreementsResponse } from "@/types/dataDisclosureAgreement";
import { B2BConnectionsListResponse, B2BConnectionDetailResponse } from "@/types/b2bConnection";
import { SignedAgreementsListResponse, SignedAgreementRecordResponse } from "@/types/signedAgreement";

// API Service implementation with real API calls
export const apiService = {
  login: async (email: string, password: string): Promise<{ access: string; refresh: string }> => {
    return api.post<{ access: string; refresh: string }>(
      ENDPOINTS.login(),
      { email, password }
    ).then(res => res.data);
  },
  // Onboarding: Code of Conduct PDF (returns a Blob URL string)
  getCodeOfConductPdf: async (): Promise<string> => {
    const primaryUrl = ENDPOINTS.codeOfConductPdf();
    try {
      const res = await axiosInstanceWithArrayBufferResType.get(primaryUrl);
      const contentType = (res.headers?.['content-type'] as string | undefined) || 'application/pdf';
      const blob = new Blob([res.data], { type: contentType.includes('pdf') ? 'application/pdf' : contentType });
      return URL.createObjectURL(blob);
    } catch (err: any) {
      // If backend explicitly returns 404, do not retry other variants; serve app-level fallback
      const status = err?.response?.status ?? err?.status;
      if (status === 404) {
        // Return route path directly so the viewer streams it without needing a blob URL
        return '/coc-fallback';
      }

      // Non-404 errors: attempt a couple of graceful fallbacks before surfacing error
      // 1) Fallback: try without/with trailing slash
      try {
        const fallbackUrl = primaryUrl.endsWith('/') ? primaryUrl.slice(0, -1) : primaryUrl + '/';
        const res = await axiosInstanceWithArrayBufferResType.get(fallbackUrl);
        const contentType = (res.headers?.['content-type'] as string | undefined) || 'application/pdf';
        const blob = new Blob([res.data], { type: contentType.includes('pdf') ? 'application/pdf' : contentType });
        return URL.createObjectURL(blob);
      } catch (e1: any) {
        if (e1?.response?.status === 404) return '/coc-fallback';
      }

      // 2) Fallback: try JSON via standard api client; accept that backend may return a url field
      try {
        const jsonRes = await api.get<any>(primaryUrl);
        const data = jsonRes.data;
        const urlCandidate = (typeof data === 'string') ? data : (data?.url || data?.pdfUrl || data?.href);
        if (urlCandidate) {
          // If it's an absolute URL, return it directly; otherwise, fetch and blob it
          if (/^https?:\/\//i.test(urlCandidate)) {
            return urlCandidate; // stream directly
          }
        }
      } catch (e2: any) {
        if (e2?.response?.status === 404) return '/coc-fallback';
      }

      // 3) Final fallback: fetch with credentials and no explicit Accept
      try {
        const f = await fetch(primaryUrl, { credentials: 'include' });
        if (f.status === 404) return '/coc-fallback';
        const blob = await f.blob();
        return URL.createObjectURL(blob);
      } catch {}

      // If all else fails and status unknown, surface  fallback to avoid blocking UI
      return '/coc-fallback';
    }
  },
  signCodeOfConduct: async (): Promise<void> => {
    await api.put(ENDPOINTS.signCodeOfConduct(), { codeOfConduct: true });
    return;
  },
  // Software Statement for Organisation
  getSoftwareStatement: async (): Promise<SoftwareStatementResponse> => {
    try {
      const response = await api.get<SoftwareStatementResponse>(ENDPOINTS.softwareStatement());
      return response.data;
    } catch (error) {
      console.error('Error fetching software statement:', error);
      throw error;
    }
  },
  requestSoftwareStatement: async (): Promise<SoftwareStatementResponse> => {
    try {
      const response = await api.post<SoftwareStatementResponse>(ENDPOINTS.softwareStatement(), null);
      return response.data;
    } catch (error) {
      console.error('Error requesting software statement:', error);
      throw error;
    }
  },
  deleteSoftwareStatement: async (): Promise<void> => {
    try {
      await api.delete<void>(ENDPOINTS.softwareStatement());
      return;
    } catch (error) {
      console.error('Error deleting software statement:', error);
      throw error;
    }
  },
  signup: async (payload: SignupPayload): Promise<any> => {
    return api.post<any>(
      ENDPOINTS.signup(),
      payload
    ).then(res => res.data);
  },
  // Public sectors (external service)
  getSectorsPublic: async (): Promise<import('@/types/onboarding').SectorsResponse> => {
    // Use absolute URL to bypass baseURL
    const url = 'https://api.nxd.foundation/onboard/sectors';
    return api.get<import('@/types/onboarding').SectorsResponse>(url)
      .then(res => res.data);
  },
  organisationList: async (): Promise<OrganisationListResponse> => {
    return api.get<OrganisationListResponse>(ENDPOINTS.organisationList())
      .then(res => res.data);
  },
  getOAuth2Clients: async (): Promise<OAuth2ClientsListResponse> => {
    return api.get<OAuth2ClientsListResponse>(ENDPOINTS.getOAuth2Clients())
      .then(res => res.data);
  },
  createOAuth2Client: async (payload: { name: string; description?: string }): Promise<OAuth2ClientCreateResponse> => {
    return api.post<OAuth2ClientCreateResponse>(ENDPOINTS.createOAuth2Client(), payload)
      .then(res => res.data);
  },
  updateOAuth2Client: async (
    clientId: string,
    payload: { name?: string; description?: string }
  ): Promise<OAuth2ClientCreateResponse> => {
    return api.put<OAuth2ClientCreateResponse>(ENDPOINTS.updateOAuth2Client(clientId), payload)
      .then(res => res.data);
  },
  // Organisation OAuth2 Client - External
  getOrganisationOAuth2ClientsExternal: async (): Promise<OrganisationOAuth2ExternalClientsListResponse> => {
    return api.get<OrganisationOAuth2ExternalClientsListResponse>(ENDPOINTS.getOrganisationOAuth2ClientsExternal())
      .then(res => res.data);
  },
  createOrganisationOAuth2ClientExternal: async (payload: { name: string; client_id: string; client_secret: string; description?: string }): Promise<OrganisationOAuth2ExternalClientResponse> => {
    return api.post<OrganisationOAuth2ExternalClientResponse>(ENDPOINTS.createOrganisationOAuth2ClientExternal(), payload)
      .then(res => res.data);
  },
  updateOrganisationOAuth2ClientExternal: async (
    clientId: string,
    payload: { name: string; client_id: string; client_secret: string; description?: string }
  ): Promise<OrganisationOAuth2ExternalClientResponse> => {
    return api.put<OrganisationOAuth2ExternalClientResponse>(ENDPOINTS.updateOrganisationOAuth2ClientExternal(clientId), payload)
      .then(res => res.data);
  },
  deleteOrganisationOAuth2ClientExternal: async (clientId: string): Promise<void> => {
    return api.delete<void>(ENDPOINTS.deleteOrganisationOAuth2ClientExternal(clientId))
      .then(res => res.data as unknown as void);
  },
  listDataDisclosureAgreements: async (
    filter: string,
    limit: number,
    offsetValue: number
  ): Promise<DDAgreementsResponse> => {
    return api.get<DDAgreementsResponse>(ENDPOINTS.listDataDisclosureAgreements(filter, limit, offsetValue))
      .then(res => res.data);
  },
  // DDA History
  getDDAHistory: async (dataDisclosureAgreementId: string): Promise<any> => {
    return api.get<any>(ENDPOINTS.getDDAHistory(dataDisclosureAgreementId)).then(res => res.data);
  },
  // B2B Connections (Organisation)
  listB2BConnections: async (
    limit: number,
    offsetValue: number
  ): Promise<B2BConnectionsListResponse> => {
    return api.get<B2BConnectionsListResponse>(ENDPOINTS.listB2BConnections(limit, offsetValue))
      .then(res => res.data);
  },
  readB2BConnection: async (b2bConnectionId: string): Promise<B2BConnectionDetailResponse> => {
    return api.get<B2BConnectionDetailResponse>(ENDPOINTS.readB2BConnection(b2bConnectionId))
      .then(res => res.data);
  },
  deleteB2BConnection: async (b2bConnectionId: string): Promise<void> => {
    return api.delete<void>(ENDPOINTS.deleteB2BConnection(b2bConnectionId))
      .then(res => res.data as unknown as void);
  },
  // Signed Agreements (Organisation)
  listSignedAgreements: async (
    limit: number,
    offsetValue: number
  ): Promise<SignedAgreementsListResponse> => {
    return api.get<SignedAgreementsListResponse>(ENDPOINTS.listSignedAgreements(limit, offsetValue))
      .then(res => res.data);
  },
  readSignedAgreement: async (id: string): Promise<SignedAgreementRecordResponse> => {
    return api.get<SignedAgreementRecordResponse>(ENDPOINTS.readSignedAgreement(id))
      .then(res => res.data);
  },
  updateDDAStatus: async (ddaId: string, payload: { status: string }): Promise<void> => {
    return api.put<void>(ENDPOINTS.updateDDAStatus(ddaId), payload)
      .then(res => res.data as unknown as void);
  },
  deleteDDA: async (ddaId: string): Promise<void> => {
    return api.delete<void>(ENDPOINTS.deleteDDA(ddaId))
      .then(res => res.data as unknown as void);
  },
  signOrSignWithBusinessWalletInitiate: async (ddaId: string): Promise<{ verificationRequest: string; status: 'sign' | 'unsign' | string; }> => {
    return api.post<{ verificationRequest: string; status: 'sign' | 'unsign' | string; }>(ENDPOINTS.signOrSignWithBusinessWalletInitiate(ddaId), {})
      .then(res => res.data);
  },
  getAdminDetails: async (): Promise<any> => {
    return api.get<any>(ENDPOINTS.getAdminDetails())
      .then(res => res.data);
  },
  getOrganisationsDetails: async (): Promise<any> => {
    return api.get<any>(ENDPOINTS.organisationsDetails())
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
      await api.put(
        ENDPOINTS.getLogoImage(),
        formData
      );
    } catch (error) {
      console.error('Error updating logo image:', error);
      throw error;
    }
  },
  getCoverImage: async (): Promise<any> => {
    const url = ENDPOINTS.getCoverImage();
    console.debug('[apiService] GET cover image:', url);
    return axiosInstanceWithArrayBufferResType.get(url).then((res) => {
      return imageBlobToBase64(res.data);
    });
  },
  getLogoImage: async (): Promise<any> => {
    const url = ENDPOINTS.getLogoImage();
    console.debug('[apiService] GET logo image:', url);
    return axiosInstanceWithArrayBufferResType.get(url).then((res) => {
      return imageBlobToBase64(res.data);
    });
  },
  // Connections listing removed
  updateOrganisationCoverImage: async (formData: FormData): Promise<any> => {
    return api.put<{ Organization: any }>(ENDPOINTS.getCoverImage(), formData)
      .then(res => res.data.Organization);
  },
  
  // Public service: organisation by ID (unauthenticated route)
  getServiceOrganisationById: async (organisationId: string): Promise<import('@/types/serviceOrganisation').ServiceOrganisationResponse> => {
    return api.get<import('@/types/serviceOrganisation').ServiceOrganisationResponse>(
      ENDPOINTS.organisationById(organisationId)
    ).then(res => res.data);
  },
  // Public service: all organisations (unauthenticated route)
  getServiceOrganisations: async (): Promise<import('@/types/serviceOrganisation').ServiceOrganisationResponse> => {
    return api.get<import('@/types/serviceOrganisation').ServiceOrganisationResponse>(
      ENDPOINTS.organisationList()
    ).then(res => res.data);
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
  getOrgIdentity: async (): Promise<OrgIdentityResponse> => {
    try {
      const response = await api.get<OrgIdentityResponse>(ENDPOINTS.orgIdentity());
      return response.data;
    } catch (error) {
      console.error('Error fetching organization identity:', error);
      throw error;
    }
  },
  createOrgIdentity: async (): Promise<OrgIdentityResponse> => {
    try {
      const response = await api.post<OrgIdentityResponse>(ENDPOINTS.orgIdentity(), null);
      return response.data;
    } catch (error) {
      console.error('Error creating organization identity:', error);
      throw error;
    }
  },
  deleteOrgIdentity: async (): Promise<void> => {
    try {
      await api.delete<void>(ENDPOINTS.orgIdentity());
      return;
    } catch (error) {
      console.error('Error deleting organization identity:', error);
      throw error;
    }
  },
  // Organisation details (current logged in user's organisation)
  getOrganisation: async (): Promise<OrganisationResponse> => {
    try {
      const response = await api.get<OrganisationResponse>(ENDPOINTS.organisationsDetails());
      return response.data;
    } catch (error) {
      console.error('Error fetching organisation details:', error);
      throw error;
    }
  },
  updateOrganisation: async (payload: OrganisationUpdatePayload): Promise<OrganisationResponse> => {
    try {
      const response = await api.put<OrganisationResponse>(ENDPOINTS.organisationsDetails(), payload);
      return response.data;
    } catch (error) {
      console.error('Error updating organisation details:', error);
      throw error;
    }
  },
  // Removed legacy data-source update API

  // Upload admin avatar image
  updateAdminAvatar: async (formData: FormData): Promise<any> => {
    try {
      const response = await api.put<any>(ENDPOINTS.adminAvatarImage(), formData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin avatar image:', error);
      throw error;
    }
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
