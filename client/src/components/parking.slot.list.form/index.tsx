import { useState, useRef, useCallback } from "react";
import { Form, useNavigate, useNavigation } from "react-router";
import { Button } from "../ui/button";
import { AdvancedMarker, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import axios from "axios";
import { envConfig } from "@/config/env.config";
import { useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";
import { functions } from "@/functions";
import { Loader2 } from "lucide-react";
import { getUserCoordinates } from "@/functions/utils/user-coordinates";

const FEATURE_OPTIONS = [
  { value: "covered", label: "Covered Parking" },
  { value: "security", label: "Security Personnel" },
  { value: "cctv", label: "CCTV Surveillance" },
  { value: "ev_charging", label: "EV Charging" },
  { value: "handicap", label: "Handicap Access" },
  { value: "valet", label: "Valet Service" },
];

const VEHICLE_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "bus", label: "Bus" },
  { value: "truck", label: "Truck" },
  { value: "bicycle", label: "Bicycle" },
];

const ParkingSpotForm = () => {
  const userCurrentLocation = useAppSelector((state) => state.location);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [isImageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListing, setIsListing] = useState<boolean>(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setLatitude(e.detail.latLng.lat);
      setLongitude(e.detail.latLng.lng);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error("Unable to get your current location. Please enable location services.");
    }
  };

  const listTheParkingSpot = useCallback(async () => {
    try {
      setIsListing(true);
      const form = document.getElementById(
        "parkingSpotForm",
      ) as HTMLFormElement;
      const formData = new FormData(form);
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

      const response = await functions.serverActions.listParkingSpot(payload);
      console.log("response is ", response);
      form.reset();
      setImagePreview(null);
      setImageUrl("");
      setLatitude(0);
      setLongitude(0);

      toast.success("Parking spot listed successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      toast.error(errorMessage);
    } finally {
      setIsListing(false);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          List Your Parking Spot
        </h1>
        <p className="mt-2 text-gray-400">
          Fill in the details below to list your parking spot on ParkEasy
        </p>
      </div>

      <Form method="post" id="parkingSpotForm" className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-100">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <input
                type="hidden"
                id="type"
                name="type"
                value={"LIST_PARKING_SPOT"}
                required
              />
              <input
                type="hidden"
                id="userId"
                name="userId"
                value={"1234567890"}
                required
              />
              <input
                type="hidden"
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                required
              />

              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Parking Spot Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="e.g. Downtown Secure Parking"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="e.g. 123 Main St, Downtown"
              />
            </div>

            <div>
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Hourly Rate (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="50"
              />
            </div>

            <div>
              <label
                htmlFor="dailyRate"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Daily Rate (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="dailyRate"
                name="dailyRate"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="500"
              />
            </div>

            <div>
              <label
                htmlFor="availableSpots"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Available Spots <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="availableSpots"
                name="availableSpots"
                min="0"
                step="1"
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Features and Vehicle Types */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-100">
              Features & Vehicle Types
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Available Features
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {FEATURE_OPTIONS.map((feature) => (
                  <label
                    key={feature.value}
                    className="flex items-center p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`feature-${feature.value}`}
                      name="features"
                      value={feature.value}
                      className="h-5 w-5 text-purple-500 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {feature.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Accepted Vehicle Types
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {VEHICLE_OPTIONS.map((vehicle) => (
                  <label
                    key={vehicle.value}
                    className="flex items-center p-3 bg-gray-700/50 border border-purple-500/20 rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`vehicle-${vehicle.value}`}
                      name="vehicleTypes"
                      value={vehicle.value}
                      className="h-5 w-5 text-purple-500 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      {vehicle.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-100">Location</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="lat"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Latitude <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="lat"
                name="lat"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="e.g. 51.5074"
              />
            </div>

            <div>
              <label
                htmlFor="lng"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Longitude <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="lng"
                name="lng"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-400"
                placeholder="e.g. -0.1278"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="px-4 py-2 bg-purple-900/50 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                Use My Current Location
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-purple-500/20">
              <div className="h-80 bg-gray-700/50">
                <Map
                  defaultCenter={{
                    lat: latitude || 53.54992,
                    lng: longitude || 0,
                  }}
                  defaultZoom={15}
                  mapId="4"
                  className="w-full h-full"
                  onClick={handleMapClick}
                >
                  {latitude && longitude && (
                    <AdvancedMarker 
                      position={{ lat: latitude, lng: longitude }}
                    />
                  )}
                </Map>
              </div>
            </div>

            <div className="mt-3 p-3 bg-purple-900/50 rounded-lg border border-purple-500/30">
              <p className="text-sm text-purple-300 flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Click on the map to set the exact location of your parking spot or use the "Use My Current Location" button above.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-purple-500/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-100">
              Parking Spot Image
            </h2>
          </div>

          <div className="mt-2">
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/20 border-dashed rounded-lg bg-gray-700/50">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];

                              // For upload
                              try {
                                setImageUploading(true);
                                const formData = new FormData();
                                formData.append("file", file);

                                const uploadImageToS3 = await axios.post(
                                  `${envConfig.SERVER_BASE_URL}/parking/upload`,
                                  formData,
                                  {
                                    headers: {
                                      "Content-Type": "multipart/form-data",
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "token",
                                      )}`,
                                    },
                                  },
                                );

                                console.log("uploadImageToS3", uploadImageToS3.data.data);
                                setImageUrl(uploadImageToS3.data.data);
                                // For preview
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setImagePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              } catch (error) {
                                console.error("Error uploading file:", error);
                                setError("Failed to upload image. Please try again.");
                              } finally {
                                setImageUploading(false);
                              }
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-700/50 border border-purple-500/20 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={listTheParkingSpot}
            disabled={isListing || isImageUploading}
            className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[200px]"
          >
            {isListing ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              "List My Parking Spot"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ParkingSpotForm;
