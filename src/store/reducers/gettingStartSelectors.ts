import { RootState } from '../store';

export const selectVerification = (state: RootState) => 
  state.gettingStart.verification.data?.verification || null;

export const selectSelectedTemplate = (state: RootState) =>
  state.gettingStart.verification.data?.selectedTemplate || null;

export const selectVerificationStatus = (state: RootState) =>
  state.gettingStart.verification.status;

export const selectVerificationError = (state: RootState) =>
  state.gettingStart.verification.error;
