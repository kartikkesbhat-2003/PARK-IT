import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserLocationType = {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
};

const initalState: UserLocationType = {
  latitude: null,
  longitude: null,
  address: null,
};

function setUserLocationReducer(
  state: UserLocationType,
  action: PayloadAction<UserLocationType>
) {
  state.latitude = action.payload.latitude;
  state.longitude = action.payload.longitude;
  state.address = action.payload.address;
}

function resetUserLocationReducer(state: UserLocationType) {
  state.latitude = null;
  state.longitude = null;
  state.address = null;
}

export const locationSlice = createSlice({
  name: "location",
  initialState: initalState,
  reducers: {
    setUserLocationReducer,
    resetUserLocationReducer,
  },
});

export const {
  setUserLocationReducer: setUserLocationAction,
  resetUserLocationReducer: resetUserLocationAction,
} = locationSlice.actions;

export default locationSlice.reducer;
