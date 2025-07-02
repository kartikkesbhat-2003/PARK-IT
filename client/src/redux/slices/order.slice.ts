import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  orderId: string | null;
  orderStatus: string | null;
  remainingTime: {
    hours: number;
    minutes: number;
    text: string;
    expired: boolean;
  };
  vehicleNumber: string | null;
  vehicleType: string | null;
  parkingSlotName: string | null;
  parkingSlotAddress: string | null;
}

const initialState: IInitialState = {
  orderId: null,
  orderStatus: null,
  remainingTime: {
    hours: 0,
    minutes: 0,
    text: "",
    expired: false,
  },
  vehicleNumber: null,
  vehicleType: null,
  parkingSlotName: null,
  parkingSlotAddress: null,
};
function setOrderReducer(
  state: IInitialState,
  action: { payload: IInitialState }
) {
  state.orderId = action.payload.orderId;
  state.orderStatus = action.payload.orderStatus;
  state.remainingTime = action.payload.remainingTime;
  state.vehicleNumber = action.payload.vehicleNumber;
  state.vehicleType = action.payload.vehicleType;
  state.parkingSlotName = action.payload.parkingSlotName;
  state.parkingSlotAddress = action.payload.parkingSlotAddress;
}

function resetOrderReducer(state: IInitialState) {
  state.orderId = null;
  state.orderStatus = null;
  state.remainingTime = {
    hours: 0,
    minutes: 0,
    text: "",
  };
  state.vehicleNumber = null;
  state.vehicleType = null;
  state.parkingSlotName = null;
  state.parkingSlotAddress = null;
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderReducer,
    resetOrderReducer,
  },
});
export const {
  setOrderReducer: setOrderAction,
  resetOrderReducer: resetOrderAction,
} = orderSlice.actions;
export default orderSlice.reducer;
