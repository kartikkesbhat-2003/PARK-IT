import React, { useEffect, useState } from "react";
import { ParkingSlot, Coordinates } from "@/@types";
import { AdvancedMarker, Map, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAppSelector } from "@/hooks/redux-hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapComponentProps {
  parkingSlots: ParkingSlot[];
  userLocation?: Coordinates;
  onSelectSlot?: (slotId: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  parkingSlots,
  onSelectSlot,
  userLocation,
}) => {
  const activeOrderDetails = useAppSelector((state) => state.order);
  const [showGoogleMapIFrame, setShowGoogleMapIFrame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    activeOrderDetails?.remainingTime.hours * 60 * 60 +
      activeOrderDetails?.remainingTime.minutes * 60
  );

  // Get location from Redux store
  const location = useAppSelector((state) => state.location);

  // Get current position using browser's geolocation with high accuracy
  const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      const options = {
        enableHighAccuracy: true, // Request the most accurate position
        timeout: 10000, // Wait up to 10 seconds
        maximumAge: 0 // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got high accuracy position:", position.coords);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting position:", error);
          reject(error);
        },
        options
      );
    });
  };

  // Handle navigation with proper validation
  const handleNavigation = async (destinationLat: number, destinationLng: number) => {
    try {
      // Always get fresh current position for navigation
      const currentPosition = await getCurrentPosition();
      console.log("Navigation starting from:", currentPosition);
      
      if (!validateCoordinates(currentPosition.lat, currentPosition.lng)) {
        toast.error("Unable to get your current location. Please enable location services.");
        return;
      }

      if (!validateCoordinates(destinationLat, destinationLng)) {
        toast.error("Destination coordinates are invalid.");
        return;
      }

      // Construct the Google Maps URL with proper parameters for navigation
      const origin = `${currentPosition.lat},${currentPosition.lng}`;
      const destination = `${destinationLat},${destinationLng}`;
      
      // Use the Google Maps navigation URL format with exact coordinates
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&dir_action=navigate&origin_place_id=ChIJb8Jg9p8Z2jERxLcFMGpzQ_0&destination_place_id=ChIJb8Jg9p8Z2jERxLcFMGpzQ_0`;
      
      console.log("Opening navigation URL:", url);
      
      // Open in a new tab
      const newWindow = window.open(url, '_blank');
      
      // Check if the window was opened successfully
      if (!newWindow) {
        toast.error("Please allow pop-ups to open Google Maps navigation.");
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      toast.error("Please enable location services to get directions.");
    }
  };

  // State for current position
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Update position when component mounts and periodically
  useEffect(() => {
    const updatePosition = async () => {
      try {
        const position = await getCurrentPosition();
        console.log("Updated current position:", position);
        setCurrentPosition(position);
      } catch (error) {
        console.error('Error updating position:', error);
        // Only use store location as fallback for map display, not for navigation
        if (location.latitude && location.longitude) {
          setCurrentPosition({
            lat: location.latitude,
            lng: location.longitude
          });
        }
      }
    };

    // Update position immediately
    updatePosition();

    // Update position every 30 seconds
    const intervalId = setInterval(updatePosition, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Validate coordinates before navigation
  const validateCoordinates = (lat: number, lng: number) => {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  console.log("parking slits", parkingSlots);

  // Google Maps libraries
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  React.useEffect(() => {
    if (!routesLibrary) return;

    const renderer = new routesLibrary.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#4285F4",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });

    setDirectionsRenderer(renderer);
  }, [routesLibrary]);

  const handleSelectSlot = (slotId: string) => {
    if (!routesLibrary || !directionsRenderer) return;
    const selectedSlot = parkingSlots.find((slot) => slot._id === slotId);
    if (!selectedSlot) return;

    if (onSelectSlot) onSelectSlot(slotId);
    setSelectedSlotId(slotId);
    const directionsService = new routesLibrary.DirectionsService();
    directionsService.route(
      {
        origin: { lat: currentPosition?.lat || 0, lng: currentPosition?.lng || 0 },
        destination: {
          lat: selectedSlot.coordinates.coordinates[1],
          lng: selectedSlot.coordinates.coordinates[0],
        },
        travelMode: routesLibrary.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
  }, [timeLeft]);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-purple-500/20 bg-gray-800/50">
      <div className="absolute inset-0 bg-gray-800">
        <div className="h-full w-full bg-cover bg-center">
          {currentPosition && (
            <Map
              defaultCenter={{
                lat: currentPosition.lat,
                lng: currentPosition.lng,
              }}
              defaultZoom={10}
              mapId="2"
            >
              <AdvancedMarker position={currentPosition}>
                <div className="flex flex-col items-center">
                  <img
                    src="https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png"
                    alt="Your current location"
                    className="w-16"
                  />
                </div>
              </AdvancedMarker>

              {parkingSlots.map((slot) => (
                <AdvancedMarker
                  key={slot._id}
                  position={{
                    lat: slot.coordinates.coordinates[1],
                    lng: slot.coordinates.coordinates[0],
                  }}
                  onClick={() => handleSelectSlot(slot._id)}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src="https://static-00.iconduck.com/assets.00/map-pin-illustration-1670x2048-j8hhkvec.png"
                      alt="User location"
                      className="w-8"
                    />

                    <div className="mt-1 px-2 py-1 bg-gray-800/90 text-xs font-medium text-gray-300 rounded-md shadow-sm border border-purple-500/20">
                      {slot.distanceInKm.toFixed(2)} km
                    </div>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          )}
        </div>
      </div>

      {(activeOrderDetails?.orderId === null ||
        activeOrderDetails.remainingTime.expired) && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-800/90 rounded-lg shadow-lg p-4 border border-purple-500/20">
          <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Your Location</h3>
          <p className="text-sm text-gray-300">
            {location?.address || "No location found"}
          </p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              {parkingSlots.length} parking spots found
            </span>
            <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors">
              Recenter
            </button>
          </div>

          {/* Distances listing */}
          {parkingSlots.length > 0 &&
            (activeOrderDetails.orderId === null ||
              activeOrderDetails.remainingTime.expired) && (
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <h4 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  Nearest Parking Slots
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {parkingSlots.slice(0, 3).map((slot) => (
                    <div
                      key={slot._id}
                      className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors
                    ${
                      selectedSlotId === slot._id
                        ? "bg-purple-900/50 border border-purple-500/30"
                        : "bg-gray-700/50 hover:bg-gray-700 border border-purple-500/10"
                    }`}
                      onClick={() => handleSelectSlot(slot._id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-4 w-4 rounded-full mr-2 
                      ${
                        selectedSlotId === slot._id
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                        ></div>
                        <span className="text-xs font-medium text-gray-300">{slot.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {slot.distanceInKm.toFixed(2)} km away
                      </span>
                    </div>
                  ))}
                </div>

                {selectedSlotId && (
                  <div className="mt-3 pt-3 border-t border-purple-500/20">
                    <button
                      className="w-full py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                      onClick={() => {
                        const selectedSlot = parkingSlots.find(
                          (slot) => slot._id === selectedSlotId
                        );
                        if (selectedSlot) {
                          handleNavigation(
                            selectedSlot.coordinates.coordinates[1],
                            selectedSlot.coordinates.coordinates[0]
                          );
                        }
                      }}
                    >
                      Navigate to{" "}
                      {parkingSlots.find((slot) => slot._id === selectedSlotId)?.name}
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
      {activeOrderDetails?.orderId &&
        activeOrderDetails?.remainingTime?.expired !== true && (
          <div className="absolute inset-x-4 bottom-6 bg-gray-800/90 rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden">
            <div
              className={`px-4 py-3 flex justify-between items-center ${
                activeOrderDetails?.orderStatus === "completed"
                  ? "bg-green-600"
                  : activeOrderDetails?.orderStatus === "cancelled"
                  ? "bg-red-600"
                  : activeOrderDetails?.orderStatus === "pendingApproval"
                  ? "bg-yellow-500"
                  : "bg-purple-600"
              }`}
            >
              <h3 className="font-medium text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-3h-5.05a2.5 2.5 0 00-4.9 0H3V4zM5 4a1 1 0 011-1h8a1 1 0 011 1v7H5V4z" />
                </svg>
                Active Parking
              </h3>
              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  activeOrderDetails?.orderStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : activeOrderDetails?.orderStatus === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : activeOrderDetails?.orderStatus === "pendingApproval"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {activeOrderDetails?.orderStatus === "pendingApproval"
                  ? "Pending Approval"
                  : activeOrderDetails?.orderStatus === "confirmed"
                  ? "Confirmed"
                  : activeOrderDetails?.orderStatus === "completed"
                  ? "Completed"
                  : activeOrderDetails?.orderStatus === "cancelled"
                  ? "Cancelled"
                  : "Unknown"}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-100">
                    {activeOrderDetails?.parkingSlotName}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">
                    {activeOrderDetails?.parkingSlotAddress}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium text-sm ${
                      activeOrderDetails?.remainingTime?.expired
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {activeOrderDetails?.remainingTime?.expired
                      ? "Expired"
                      : timeLeft
                      ? `${Math.floor(timeLeft / 3600)}h ${Math.floor(
                          (timeLeft % 3600) / 60
                        )}min ${timeLeft % 60}s`
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-700/50 rounded-lg p-2 border border-purple-500/20">
                  <div className="text-xs text-gray-400">Vehicle</div>
                  <div className="font-medium text-gray-200 text-sm capitalize">
                    {activeOrderDetails?.vehicleType || "N/A"}
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2 border border-purple-500/20">
                  <div className="text-xs text-gray-400">Number</div>
                  <div className="font-medium text-gray-200">
                    {activeOrderDetails?.vehicleNumber || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Order #{activeOrderDetails?.orderId}...
                </div>
                <Button
                  onClick={() => {
                    const slot = parkingSlots.find(
                      (slot) => slot.name === activeOrderDetails?.parkingSlotName
                    );
                    if (!slot) {
                      toast.error("Parking spot information not available.");
                      return;
                    }
                    handleNavigation(
                      slot.coordinates.coordinates[1],
                      slot.coordinates.coordinates[0]
                    );
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 cursor-pointer"
                >
                  Direction
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default MapComponent;
