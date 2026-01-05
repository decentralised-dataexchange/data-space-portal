import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VerificationTemplate, Verification } from '@/types/verification';
import type { OrgIdentityResponse } from '@/types/orgIdentity';

interface ListConnectionState {
  data: unknown;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface VerificationTemplatesData {
  verificationTemplates: VerificationTemplate[];
}

interface VerificationTemplateState {
  data: VerificationTemplatesData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface VerificationStateData {
  verification: Verification | null;
  selectedTemplate: VerificationTemplate | null;
}

interface VerificationState {
  data: VerificationStateData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface GettingStartState {
  data: Partial<OrgIdentityResponse> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  listConnection: ListConnectionState;
  verificationTemplate: VerificationTemplateState;
  verification: VerificationState;
  imageSet: {
    logo: string | null;
    cover: string | null;
  };
}

const initialState: GettingStartState = {
  data: null,
  status: 'idle',
  error: null,
  listConnection: { data: null, status: 'idle', error: null },
  verificationTemplate: { data: null, status: 'idle', error: null },
  verification: { 
    data: { 
      verification: null, 
      selectedTemplate: null 
    }, 
    status: 'idle', 
    error: null 
  },
  imageSet: { logo: null, cover: null },
};

const gettingStartSlice = createSlice({
  name: 'gettingStart',
  initialState,
  reducers: {
    setGettingStartLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setGettingStartSuccess(state, action: PayloadAction<Partial<OrgIdentityResponse>>) {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    setGettingStartFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    setListConnectionLoading(state) {
      state.listConnection.status = 'loading';
      state.listConnection.error = null;
    },
    setListConnectionSuccess(state, action: PayloadAction<unknown>) {
      state.listConnection.status = 'succeeded';
      state.listConnection.data = action.payload;
    },
    setListConnectionFailure(state, action: PayloadAction<string>) {
      state.listConnection.status = 'failed';
      state.listConnection.error = action.payload;
    },
    setVerificationTemplateLoading(state) {
      state.verificationTemplate.status = 'loading';
      state.verificationTemplate.error = null;
    },
    setVerificationTemplateSuccess(state, action: PayloadAction<VerificationTemplatesData>) {
      state.verificationTemplate.status = 'succeeded';
      state.verificationTemplate.data = action.payload;
    },
    setVerificationTemplateFailure(state, action: PayloadAction<string>) {
      state.verificationTemplate.status = 'failed';
      state.verificationTemplate.error = action.payload;
    },
    setVerificationLoading(state) {
      state.verification.status = 'loading';
      state.verification.error = null;
    },
    setVerificationSuccess(state, action: PayloadAction<Verification>) {
      state.verification.status = 'succeeded';
      if (!state.verification.data) {
        state.verification.data = { verification: null, selectedTemplate: null };
      }
      state.verification.data.verification = action.payload;
    },
    setVerificationFailure(state, action: PayloadAction<string>) {
      state.verification.status = 'failed';
      state.verification.error = action.payload;
    },
    setSelectedTemplate(state, action: PayloadAction<VerificationTemplate | null>) {
      if (!state.verification.data) {
        state.verification.data = { verification: null, selectedTemplate: null };
      }
      state.verification.data.selectedTemplate = action.payload;
    },
    setVerification(state, action: PayloadAction<{ verification: Verification | null }>) {
      if (!state.verification.data) {
        state.verification.data = { verification: null, selectedTemplate: null };
      }
      state.verification.data.verification = action.payload.verification;
      state.verification.status = 'succeeded';
      state.verification.error = null;
    },
    setVerificationError(state, action: PayloadAction<string>) {
      state.verification.status = 'failed';
      state.verification.error = action.payload;
    },
    resetVerification(state) {
      state.verification = {
        data: { verification: null, selectedTemplate: null },
        status: 'idle',
        error: null
      };
    },
    setImages(state, action: PayloadAction<{logo: string | null, cover: string | null}>) {
      state.imageSet = action.payload;
    },
  },
});

export const { 
  setGettingStartLoading, 
  setGettingStartSuccess, 
  setGettingStartFailure,
  setListConnectionLoading,
  setListConnectionSuccess,
  setListConnectionFailure,
  setVerificationTemplateLoading,
  setVerificationTemplateSuccess,
  setVerificationTemplateFailure,
  setVerificationLoading,
  setVerificationSuccess,
  setVerificationFailure,
  setSelectedTemplate,
  setVerification,
  setVerificationError,
  resetVerification,
  setImages
} = gettingStartSlice.actions;

export default gettingStartSlice.reducer;
