import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Header,
  FilterSidebar,
  MobileFilterModal,
  ParkingSlotList,
  MapComponent,
} from "./_components";
import { FilterState, ParkingSlot } from "@/@types";
import { vehicleTypeOptions, featureOptions } from "@/constants";
import { Navigate, useLoaderData } from "react-router";
import { useAppSelector } from "@/hooks/redux-hooks";

const ParkingSlotsPage: React.FC = () => {
  const parkingSlots = useLoaderData() as ParkingSlot[];
  const userRole = useAppSelector((state) => state.user.role);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Calculate max values from original data
  const maxHourlyPrice = useMemo(() => {
    if (!parkingSlots || parkingSlots.length === 0) return 100;
    return Math.max(...parkingSlots.map((slot) => slot.hourlyRate));
  }, [parkingSlots]);

  const maxDistanceInKMS = useMemo(() => {
    if (!parkingSlots || parkingSlots.length === 0) return 10;
    return Math.max(...parkingSlots.map((slot) => slot.distanceInKm));
  }, [parkingSlots]);

  // Initialize filters with proper default values
  const [filters, setFilters] = useState<FilterState>({
    vehicleTypes: [],
    features: [],
    priceRange: [0, 100], // Will be updated once max values are calculated
    maxDistance: 10, // Will be updated once max values are calculated
    minRating: 0,
  });

  // Initialize filter ranges after max values are calculated
  useEffect(() => {
    if (maxHourlyPrice > 0 && maxDistanceInKMS > 0 && !filtersInitialized) {
      setFilters({
        vehicleTypes: [],
        features: [],
        priceRange: [0, maxHourlyPrice],
        maxDistance: Math.ceil(maxDistanceInKMS),
        minRating: 0,
      });
      setFiltersInitialized(true);
    }
  }, [maxHourlyPrice, maxDistanceInKMS, filtersInitialized]);

  const toggleFilters = (): void => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: any
  ): void => {
    const newFilters = { ...filters };

    if (filterType === "vehicleTypes" || filterType === "features") {
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    } else if (filterType === "minRating" || filterType === "maxDistance") {
      newFilters[filterType] = parseFloat(value);
    } else if (filterType === "priceRange") {
      newFilters.priceRange = value;
    }

    setFilters(newFilters);
  };

  // Combined filtering logic that includes search
  const filteredSlots = useMemo(() => {
    if (userRole === "owner") {
      return [];
    }

    // Return all slots if filters haven't been initialized yet
    if (!filtersInitialized) {
      return parkingSlots;
    }

    let result = [...parkingSlots];

    // Apply search filter first
    if (searchTerm.trim()) {
      result = result.filter((slot) =>
        slot.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply vehicle type filter
    if (filters.vehicleTypes.length > 0) {
      result = result.filter((slot) =>
        filters.vehicleTypes.some((type) => slot.vehicleTypes.includes(type))
      );
    }

    // Apply features filter
    if (filters.features.length > 0) {
      result = result.filter((slot) =>
        filters.features.some((feature) => slot.features.includes(feature))
      );
    }

    // Apply price range filter
    result = result.filter(
      (slot) =>
        slot.hourlyRate >= filters.priceRange[0] &&
        slot.hourlyRate <= filters.priceRange[1]
    );

    // Apply distance filter
    result = result.filter((slot) => slot.distanceInKm <= filters.maxDistance);

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter((slot) => slot.rating >= filters.minRating);
    }

    console.log("Filtering debug:", {
      originalCount: parkingSlots.length,
      searchResults: searchTerm ? result.length : "no search",
      finalCount: result.length,
      filters: filters,
      maxHourlyPrice,
      maxDistanceInKMS,
    });

    return result;
  }, [
    filters,
    parkingSlots,
    searchTerm,
    userRole,
    filtersInitialized,
    maxHourlyPrice,
    maxDistanceInKMS,
  ]);

  const clearFilters = (): void => {
    setFilters({
      vehicleTypes: [],
      features: [],
      priceRange: [0, maxHourlyPrice],
      maxDistance: Math.ceil(maxDistanceInKMS),
      minRating: 0,
    });
    setSearchTerm("");
  };

  const handleBookNow = (slotId: string): void => {
    console.log(`Booking slot ${slotId}`);
  };

  // Search handler that only updates search term
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  // Redirect if user is owner
  if (userRole === "owner") {
    return <Navigate to="/parking-owner/active-orders" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 w-full">
      <div className="flex flex-col min-h-screen max-w-screen-2xl mx-auto">
        <Header onSearch={handleSearch} />

        <div className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <MobileFilterModal
              isOpen={showFilters}
              onClose={toggleFilters}
              filters={filters}
              vehicleTypeOptions={vehicleTypeOptions}
              featureOptions={featureOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              resultsCount={filteredSlots.length}
            />

            <FilterSidebar
              filters={filters}
              vehicleTypeOptions={vehicleTypeOptions}
              featureOptions={featureOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              className="hidden md:block w-76 sticky top-6"
              maxHourlyPrice={maxHourlyPrice}
              maxDistanceInKMS={maxDistanceInKMS}
            />

            <div className="flex-1 gap-6 flex flex-col lg:flex-row lg:w-96 h-[calc(100vh-4rem)] lg:sticky top-12 overflow-auto">
              {/* Parking slots list */}
              <ParkingSlotList
                parkingSlots={filteredSlots}
                onBookNow={handleBookNow}
                onClearFilters={clearFilters}
              />

              <div className="lg:w-96 h-[calc(100vh-8rem)] lg:sticky top-0">
                <MapComponent
                  parkingSlots={filteredSlots}
                  userLocation={{
                    type: "Point",
                    coordinates: [-74.006, 40.7128] // [longitude, latitude] for GeoJSON format
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingSlotsPage;
