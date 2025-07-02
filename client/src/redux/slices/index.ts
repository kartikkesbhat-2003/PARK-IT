import {
  resetUserLocationAction,
  setUserLocationAction,
} from "./location.slice";
import { setUserAction } from "./user.slice";

export const reduxActions = {
  location: {
    setUserLocationAction: setUserLocationAction,
    resetUserLocationAction: resetUserLocationAction,
  },
  user: {
    setUserAction: setUserAction,
    resetUserAction: resetUserLocationAction,
  },
};
