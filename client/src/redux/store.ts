import { configureStore } from "@reduxjs/toolkit";

import locationReducer from "./slices/location.slice";
import userReducer from "./slices/user.slice";
import orderReducer from "./slices/order.slice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    user: userReducer,
    order: orderReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
