import axios from "axios";
import { envConfig } from "@/config/env.config";

export const getUserAddressBasedOnCoordinates = async (
  latitude: number,
  longitude: number
) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${envConfig.VITE_MAP_API_KEY}`
  );
  const formattedAddress = response.data.results[0].formatted_address;
  if (!localStorage.getItem("userAddress")) {
    localStorage.setItem("userAddress", formattedAddress);
  }

  return formattedAddress;
};
