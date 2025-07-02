import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Car,
  Clock,
  Calendar,
  Plus,
  DollarSign,
  Shield,
  Camera,
  Zap,
  Accessibility,
  Umbrella,
  UserCheck,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { envConfig } from "@/config/env.config";
import { useNavigate } from "react-router";

interface ParkingSpot {
  _id: string;
  name: string;
  address: string;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  totalReviews: number;
  availableSpots: number;
  vehicleTypes: string[];
  features: string[];
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OwnerParkingSpotsPage: React.FC = () => {
  const navigate = useNavigate();

  const [spots, setSpots] = useState<ParkingSpot[] | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Feature icons mapping
  const featureIcons: Record<string, React.ReactNode> = {
    covered: <Umbrella className="w-4 h-4" />,
    security: <Shield className="w-4 h-4" />,
    cctv: <Camera className="w-4 h-4" />,
    ev_charging: <Zap className="w-4 h-4" />,
    handicap: <Accessibility className="w-4 h-4" />,
    valet: <UserCheck className="w-4 h-4" />,
  };

  // Vehicle type colors
  const vehicleTypeColors: Record<string, string> = {
    car: "bg-blue-100 text-blue-800",
    motorcycle: "bg-orange-100 text-orange-800",
    bus: "bg-green-100 text-green-800",
    truck: "bg-gray-100 text-gray-800",
    bicycle: "bg-yellow-100 text-yellow-800",
    suv: "bg-purple-100 text-purple-800",
    ev: "bg-emerald-100 text-emerald-800",
  };

  // Filter and search functionality

  const calculateMonthlyRevenue = (spot: ParkingSpot): number => {
    return spot.dailyRate * spot.availableSpots * 20; // Assuming 20 working days
  };

  const ParkingSpotCard: React.FC<{ spot: ParkingSpot }> = ({ spot }) => (
    <div className="bg-gray-800/50 rounded-xl shadow-lg border border-purple-500/20 overflow-hidden hover:shadow-purple-500/10 transition-all duration-300">
      <div className="relative">
        <img
          src={`https://d28fpa5kkce5uk.cloudfront.net/${spot.imageUrl}`}
          alt={spot.name}
          className="w-full h-32 sm:h-48 object-cover"
        />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
              spot.isActive
                ? "bg-green-900/50 text-green-400 border border-green-500/30"
                : "bg-red-900/50 text-red-400 border border-red-500/30"
            }`}
          >
            {spot.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">
          {spot.name}
        </h3>
        <div className="flex items-start text-gray-400 mb-3 sm:mb-4">
          <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs sm:text-sm">{spot.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center text-gray-300">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
            <span className="text-xs sm:text-sm">₹{spot.hourlyRate}/hr</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-pink-400" />
            <span className="text-xs sm:text-sm">₹{spot.dailyRate}/day</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Car className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
            <span className="text-xs sm:text-sm">{spot.availableSpots} spots</span>
          </div>
          <div className="flex items-center text-gray-300">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-pink-400" />
            <span className="text-xs sm:text-sm">
              ₹{calculateMonthlyRevenue(spot).toLocaleString()}/mo
            </span>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Vehicle Types:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {spot.vehicleTypes.map((type) => (
              <span
                key={type}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-gray-700/50 text-gray-200 border border-purple-500/20`}
              >
                {type.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Features:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {spot.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-1 bg-gray-700/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-purple-500/20"
              >
                {featureIcons[feature]}
                <span className="text-xs text-gray-200 capitalize">
                  {feature.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const fetchSpots = useCallback(async () => {
    try {
      const data = await fetch(
        `${envConfig.SERVER_BASE_URL}/parking/all/active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const response = await data.json();
      if (response.data.length > 0) {
        setSpots(response.data);
      }
      console.log("response", response);

      // if (response.success) {
      //   setSpots(response.data.parkingSpots);
      // }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-purple-500/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
                My Parking Spots
              </h1>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Manage your parking locations and track performance
              </p>
            </div>
            {/* <button
              onClick={() => {
                navigate("parking-owner/list-parking-spot");
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Spot
            </button> */}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Parking Spots Grid */}
        {spots && spots.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-200 mb-2">
              No parking spots found
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Try adjusting your search or filters, or add a new parking spot.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {spots &&
              spots.map((spot) => (
                <ParkingSpotCard key={spot._id} spot={spot} />
              ))}

            {!spots && (
              <div className="text-center py-8 sm:py-12">
                <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-200 mb-2">
                  Loading parking spots...
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerParkingSpotsPage;
