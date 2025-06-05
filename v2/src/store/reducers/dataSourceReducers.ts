import { DataSourceListResponse } from '@/types/dataDisclosureAgreement';
import { createReducer, createSlice } from '@reduxjs/toolkit';

type DataSourceSlice = {
  isLoading: boolean;
  list: DataSourceListResponse["dataSources"][];
  selectedDDAId: string;
  selectedOpenApiUrl: string;
}

const initialState: DataSourceSlice = {
  isLoading: false,
  list: [],
  selectedDDAId: "",
  selectedOpenApiUrl: ""
};

const dataSourcesSlice = createSlice({
  name: "dataSources",
  initialState,
  reducers: {
    setSelectedDDAId: (state, action) => {
      state.selectedDDAId = action.payload as string;
    },
    clearSelectedDDAId: (state) => {
      state.selectedDDAId = "";
    },
    setDataSources: (state, action) => {
      state.list = action.payload;
    },
    clearDataSources: (state) => {
      state.list = [];
    },
    setSelectedOpenApiUrl: (state, action) => {
      state.selectedOpenApiUrl = action.payload as string;
    },
    clearSelectedOpenApiUrl: (state) => {
      state.selectedOpenApiUrl = "";
    }
  }
})

export default dataSourcesSlice.reducer
export const { setSelectedDDAId, clearSelectedDDAId, setDataSources, clearDataSources, setSelectedOpenApiUrl, clearSelectedOpenApiUrl } = dataSourcesSlice.actions
