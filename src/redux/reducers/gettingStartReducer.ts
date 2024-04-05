import { createReducer } from '@reduxjs/toolkit';
import { gettingStartAction, 
         gettingStartActionSuccess, 
         gettingStartActionFailure, 
         listConnectionAction,
         listConnectionActionSuccess,
         listConnectionActionFailure,
         verificationTemplateSuccess,
         createVerificationSuccess
} from '../actionCreators/gettingStart';

const initialState = {
  isLoading: false,
  data: null,
  listConnection: {
    isLoading: false,
    data: null
  },
  verificationTemplate: {
    isLoading: false,
    data: null,
  },
  verifyConnection: {
    isLoading: false,
    data: null,
  }
};

export default {
  gettingStart: createReducer(initialState, (builder) => {
    builder
      .addCase(gettingStartAction, (state) => {
        state.isLoading = true;
      });
    builder
      .addCase(gettingStartActionSuccess, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(gettingStartActionFailure, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(listConnectionAction, (state) => {
        state.listConnection.isLoading = true;
      });
    builder
      .addCase(listConnectionActionSuccess, (state, action) => {
        state.listConnection.isLoading = false;
        state.listConnection.data = action.payload;
      });
    builder
      .addCase(listConnectionActionFailure, (state, action) => {
        state.isLoading = false;
        state.listConnection.data = action.payload;
      });
    builder
      .addCase(verificationTemplateSuccess, (state, action) => {
        state.isLoading = false;
        state.verificationTemplate.data = action.payload;
      });
    builder
      .addCase(createVerificationSuccess, (state, action) => {
        state.isLoading = false;
        state.verifyConnection.data = action.payload;
      });
  }),
};