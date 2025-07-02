// src/components/ParkingSlotList.tsx
import React from "react";
import ParkingCard from "../parking.card";
import EmptyState from "../empty.state";
import { ParkingSlot } from "@/@types";

interface ParkingSlotsListProps {
  parkingSlots: ParkingSlot[];
  onBookNow: (slotId: string) => void;
  onClearFilters: () => void;
}

const ParkingSlotList: React.FC<ParkingSlotsListProps> = ({
  parkingSlots,
  onBookNow,
  onClearFilters,
}) => {
  const [sortOption, setSortOption] = React.useState("nearest");

  const sortedSlots = React.useMemo(() => {
    const slots = [...parkingSlots];

    switch (sortOption) {
      case "price-low":
        return slots.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case "price-high":
        return slots.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case "rating":
        return slots.sort((a, b) => b.rating - a.rating);
      case "availability":
        return slots.sort((a, b) => b.availableSpots - a.availableSpots);
      case "nearest":
      default:
        return slots.sort((a, b) => a.distance - b.distance);
    }
  }, [parkingSlots, sortOption]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Available Spots
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-purple-400 font-medium px-2 py-0.5 border border-purple-500/30 rounded-full bg-purple-900/50 shrink-0">
            {parkingSlots.length} spots found
          </span>

          <select
            className="text-sm bg-gray-800/50 border border-purple-500/20 rounded-md py-1 pl-2 pr-8 text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="nearest">Sort by: Nearest</option>
            <option value="price-low">Sort by: Price (Low to High)</option>
            <option value="price-high">Sort by: Price (High to Low)</option>
            <option value="rating">Sort by: Rating</option>
            <option value="availability">Sort by: Availability</option>
          </select>
        </div>
      </div>

      {sortedSlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedSlots.map((slot) => (
            <ParkingCard key={slot._id} slot={slot} onBookNow={onBookNow} />
          ))}
        </div>
      ) : (
        <EmptyState onClearFilters={onClearFilters} />
      )}
    </div>
  );
};

export default ParkingSlotList;
