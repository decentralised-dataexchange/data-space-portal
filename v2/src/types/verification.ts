export interface VerificationTemplate {
  id: string;
  name: string;
  description: string;
  issuerId: string;
  issuerName: string;
  issuerLocation: string;
  walletName: string;
  walletLocation: string;
  available: boolean;
  requiredFields: string[];
  issuerLogoUrl?: string;
  [key: string]: any; // Allow additional properties
}

export interface PresentationRecord {
  id: string;
  status: 'pending' | 'verified' | 'failed' | 'requested';
  presentation?: {
    requested_proof: {
      revealed_attrs: Record<string, { raw: string }>;
    };
  };
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface Verification {
  id: string;
  status: 'pending' | 'verified' | 'failed';
  templateId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  presentationRecord?: PresentationRecord;
  error?: string;
  [key: string]: any; // Allow additional properties
}

export interface OrganizationVerification {
  id: string | null;
  status: 'pending' | 'verified' | 'failed' | 'not_started';
  attempts: number;
}

export interface OrganizationVerificationResponse {
  id: string;
  name: string;
  isVerified: boolean;
  verification: OrganizationVerification;
}

export type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error';
