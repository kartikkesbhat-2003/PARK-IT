import { envConfig } from "@/config/env.config";
interface ICoordinates {
  lat: number;
  lng: number;
}

type ListParkingSpotPayloadType = {
  name: string;
  address: string;
  hourlyRate: number;
  dailyRate: number;
  availableSpots: number;
  vehicleTypes: string[];
  features: string[];
  imageUrl: string;
  coordinates: ICoordinates;
  owner: string;
};

export const listParkingSpot = async (payload: ListParkingSpotPayloadType) => {
  const serverResponse = await fetch(
    `${envConfig.SERVER_BASE_URL}/parking/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!serverResponse.ok) {
    const error = await serverResponse.json();
    throw new Error(error.message);
  }

  return serverResponse.json().then(
    (data) => {
      return data;
    },
    (error) => {
      throw error;
    }
  );
};
