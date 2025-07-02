import React from "react";
import { Car, Filter } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-purple-500/20 p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-full mb-4 border border-purple-500/20">
        <Car size={24} className="text-purple-400" />
      </div>
      <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
        No parking spots found
      </h3>
      <p className="text-gray-400 mb-4">
        Try adjusting your filters to see more results.
      </p>
      <button
        onClick={onClearFilters}
        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        <Filter size={16} className="mr-2" />
        Clear all filters
      </button>
    </div>
  );
};

export default EmptyState;
