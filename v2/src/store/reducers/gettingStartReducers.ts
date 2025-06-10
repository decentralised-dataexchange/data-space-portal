import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListConnectionState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface VerificationTemplateState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface VerificationState {
  data: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface GettingStartState {
  data: any;
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
  verification: { data: null, status: 'idle', error: null },
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
    setGettingStartSuccess(state, action: PayloadAction<any>) {
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
    setListConnectionSuccess(state, action: PayloadAction<any>) {
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
    setVerificationTemplateSuccess(state, action: PayloadAction<any>) {
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
    setVerificationSuccess(state, action: PayloadAction<any>) {
      state.verification.status = 'succeeded';
      state.verification.data = action.payload;
    },
    setVerificationFailure(state, action: PayloadAction<string>) {
      state.verification.status = 'failed';
      state.verification.error = action.payload;
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
  setImages,
} = gettingStartSlice.actions;

export default gettingStartSlice.reducer;
