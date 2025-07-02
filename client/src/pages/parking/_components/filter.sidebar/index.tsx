import { Star } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const vehicleTypes = ["Car", "Bike", "Truck", "Bus"];
const features = [
  "24/7",
  "Security",
  "Covered",
  "Open",
  "Valet",
  "EV Charging",
  "Wheelchair Access",
];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    minRating: 0,
    vehicleTypes: [] as string[],
    features: [] as string[],
  });

  const handleResetFilters = () => {
    const resetFilters = {
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      vehicleTypes: [],
      features: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="w-64 bg-gray-800/50 border-r border-purple-500/20 p-4 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Price Range
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Min Price (₹/hr)
              </label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                placeholder="Min price"
              />
            </div>
            <div>
              <label
                htmlFor="maxPrice"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Max Price (₹/hr)
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                placeholder="Max price"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Rating
          </h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => setFilters({ ...filters, minRating: rating })}
                  className="w-4 h-4 text-purple-500 border-purple-500/30 focus:ring-purple-500/50 bg-gray-700/50"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < rating
                          ? "text-yellow-500"
                          : "text-gray-600 group-hover:text-gray-500"
                      }`}
                      fill={i < rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">& Up</span>
              </label>
            ))}
          </div>
        </div>

        {/* Vehicle Types */}
        <div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Vehicle Types
          </h3>
          <div className="space-y-2">
            {vehicleTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.vehicleTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.vehicleTypes, type]
                      : filters.vehicleTypes.filter((t) => t !== type);
                    setFilters({ ...filters, vehicleTypes: newTypes });
                  }}
                  className="w-4 h-4 text-purple-500 border-purple-500/30 rounded focus:ring-purple-500/50 bg-gray-700/50"
                />
                <span className="text-sm text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Features
          </h3>
          <div className="space-y-2">
            {features.map((feature) => (
              <label
                key={feature}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={(e) => {
                    const newFeatures = e.target.checked
                      ? [...filters.features, feature]
                      : filters.features.filter((f) => f !== feature);
                    setFilters({ ...filters, features: newFeatures });
                  }}
                  className="w-4 h-4 text-purple-500 border-purple-500/30 rounded focus:ring-purple-500/50 bg-gray-700/50"
                />
                <span className="text-sm text-gray-300">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 