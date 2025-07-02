import { envConfig } from "@/config/env.config";
import { reduxActions } from "@/redux/slices";
import { store } from "@/redux/store";
import { LoaderFunction, redirect } from "react-router";

export const layoutLoader: LoaderFunction = async ({ request, params }) => {
  console.log("ROOT LAYOUT LOADER IS RUNNING REQUEST", request);
  console.log("ROOT LAYOIT PARAMS IS RUNNIGN", params);
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/login");
  }
  const response = await fetch(`${envConfig.SERVER_BASE_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    throw redirect("/login");
  }

  const user = await response.json();
  store.dispatch(reduxActions.user.setUserAction(user));

  return null;

  // if (!store.getState().location.address) {
  //   const userCoordinates = await functions.utils.getUserCoordinates();
  //   const userLocation = await functions.utils.getUserAddressBasedOnCoordinates(
  //     userCoordinates.latitude,
  //     userCoordinates.longitude
  //   );

  //   const payload = {
  //     latitude: userCoordinates.latitude,
  //     longitude: userCoordinates.longitude,
  //     address: userLocation,
  //   };

  //   store.dispatch(reduxActions.location.setUserLocationAction(payload));
  //   return { payload };
  // }

  // const payload = {
  //   latitude: store.getState().location.latitude,
  //   longitude: store.getState().location.longitude,
  //   address: store.getState().location.address,
  // };

  // return { payload };
};
