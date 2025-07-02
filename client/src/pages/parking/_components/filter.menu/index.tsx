import React from "react";
import { FilterState, FilterOption } from "@/@types";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  filters: FilterState;
  vehicleTypeOptions: FilterOption[];
  featureOptions: FilterOption[];
  onFilterChange: (filterType: keyof FilterState, value: unknown) => void;
  onClearFilters: () => void;
  className?: string;
  maxHourlyPrice?: number;
  maxDistanceInKMS?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  vehicleTypeOptions,
  featureOptions,
  onFilterChange,
  onClearFilters,
  className = "",
  maxHourlyPrice,
  maxDistanceInKMS,
}) => {
  return (
    <div
      className={`bg-gray-800/50 rounded-lg border border-purple-500/20 h-fit ${className}`}
    >
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
        <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Filters</h2>
        <Button
          variant={"link"}
          onClick={onClearFilters}
          size={"sm"}
          className="cursor-pointer text-purple-400 hover:text-purple-300"
        >
          Clear All Filters
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Vehicle Type */}
        <div className="space-y-2">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Vehicle Type</h3>
          <div className="space-y-1 grid grid-cols-2">
            {vehicleTypeOptions.map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-purple-500 border-purple-500/30 focus:ring-purple-500/50 bg-gray-700/50 mr-2"
                  checked={filters.vehicleTypes.includes(option.id)}
                  onChange={() => onFilterChange("vehicleTypes", option.id)}
                />
                <span className="text-sm text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Features</h3>
          <div className="space-y-1">
            {featureOptions.map((option) => (
              <label key={option.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-purple-500 border-purple-500/30 focus:ring-purple-500/50 bg-gray-700/50 mr-2"
                  checked={filters.features.includes(option.id)}
                  onChange={() => onFilterChange("features", option.id)}
                />
                <span className="text-sm text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hourly Price Range</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">₹{filters.priceRange[0]}</span>
            <input
              type="range"
              min="5"
              max={maxHourlyPrice || 1000}
              step="5"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange("priceRange", [
                  filters.priceRange[0],
                  parseFloat(e.target.value),
                ])
              }
              className="flex-1 accent-purple-500"
            />
            <span className="text-sm text-gray-300">₹{filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-2">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Max Distance</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 shrink-0">0 KM</span>
            <input
              type="range"
              min="0.5"
              max={maxDistanceInKMS || 50}
              step="0.5"
              value={filters.maxDistance}
              onChange={(e) =>
                onFilterChange("maxDistance", parseFloat(e.target.value))
              }
              className="flex-1 accent-purple-500"
            />
            <span className="text-sm text-gray-300 shrink-0">{filters.maxDistance} KM</span>
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Minimum Rating</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterChange("minRating", rating)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  filters.minRating >= rating
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
