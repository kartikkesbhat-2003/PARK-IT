import { envConfig } from "@/config/env.config";
import { functions } from "@/functions";
import { reduxActions } from "@/redux/slices";
import { store } from "@/redux/store";
import axios from "axios";
import { LoaderFunction } from "react-router";

export const loaderFunction: LoaderFunction = async () => {
  try {
    const userCoordinates = await functions.utils.getUserCoordinates();

    const userLocation = await functions.utils.getUserAddressBasedOnCoordinates(
      userCoordinates.latitude,
      userCoordinates.longitude
    );

    const payload = {
      latitude: userCoordinates.latitude,
      longitude: userCoordinates.longitude,
      address: userLocation,
    };

    store.dispatch(reduxActions.location.setUserLocationAction(payload));

    if (userCoordinates.latitude === 0 && userCoordinates.longitude === 0) {
      const getNearBySpaces = await axios.get(
        `${envConfig.SERVER_BASE_URL}/parking/nearby/spots`
      );

      return getNearBySpaces.data.data;
    }

    const getNearBySpaces = await axios.get(
      `${envConfig.SERVER_BASE_URL}/parking/nearby/spots?lat=${userCoordinates.latitude}&lng=${userCoordinates.longitude}`
    );

    console.log("getNearBySpaces is ", getNearBySpaces);

    return getNearBySpaces.data.data;
  } catch (error) {
    console.error("Error fetching nearby spaces: ", error);
    throw new Response("Error fetching nearby spaces", { status: 500 });
  }
};
