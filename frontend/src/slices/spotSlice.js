import { createSlice } from "@reduxjs/toolkit";

const spotSlice = createSlice({
  name: "spots",
  initialState: {
    spots: [], // List of all parking spots
    loading: false,
    error: null,
  },
  reducers: {
    fetchSpotsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSpotsSuccess: (state, action) => {
      state.loading = false;
      state.spots = action.payload; // Array of parking spots
    },
    fetchSpotsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Error message
    },
  },
});

export const { fetchSpotsRequest, fetchSpotsSuccess, fetchSpotsFailure } = spotSlice.actions;

export default spotSlice.reducer;
