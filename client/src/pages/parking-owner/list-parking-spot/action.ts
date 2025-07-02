import { functions } from "@/functions";
import { ActionFunction } from "react-router-dom";

export const parkingListFormAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const type = formData.get("type") as string;

  if (type === "LIST_PARKING_SPOT") {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const hourlyRate = formData.get("hourlyRate") as string;
    const dailyRate = formData.get("dailyRate") as string;
    const availableSpots = formData.get("availableSpots") as string;
    const vehicleTypes = formData.getAll("vehicleTypes").map(String);
    const features = formData.getAll("features").map(String);
    const imageUrl = formData.get("imageUrl") as string;
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;
    const userId = formData.get("userId") as string;

    // Validate required fields
    if (
      !name ||
      !address ||
      !hourlyRate ||
      !dailyRate ||
      !availableSpots ||
      !vehicleTypes.length ||
      !features.length ||
      !imageUrl ||
      !lat ||
      !lng ||
      !userId
    ) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    const payload = {
      name,
      address,
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
      availableSpots: Number(availableSpots),
      vehicleTypes,
      features,
      imageUrl,
      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
      },
      owner: userId,
    };

    try {
      const response = await functions.serverActions.listParkingSpot(payload);
      return {
        success: true,
        data: response,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: "Failed to list parking spot",
      };
    }
  }

  return {
    success: false,
    error: "Invalid action type",
  };
};
