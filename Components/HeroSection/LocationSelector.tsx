"use client";

import {
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Plus,
  Minus,
  X,
} from "lucide-react";

interface Location {
  id: number;
  name: string;
  branch: string;
}

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect,
  isOpen,
  onToggle,
}) => {
  const locations = [
    { id: 1, name: "Tower A", branch: "Haven 9" },
    { id: 2, name: "Tower A", branch: "Haven 67" },
    { id: 3, name: "Tower D", branch: "Haven 1" },
    { id: 4, name: "Tower D", branch: "Haven 2" },
    { id: 5, name: "Tower D", branch: "Haven 3" },
    { id: 5, name: "Tower D", branch: "Haven 4" },
    { id: 5, name: "Tower D", branch: "Haven 5" },
    { id: 5, name: "Tower D", branch: "Haven 6" },
    { id: 5, name: "Tower D", branch: "Haven 7" },
    { id: 5, name: "Tower D", branch: "Haven 8" },
    { id: 5, name: "Tower D", branch: "Haven 9" },
  ];

  return (
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className="w-full h-14 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:shadow-md"
      >
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Where</p>
          <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 dark:text-white truncate">
            {selectedLocation?.name || "Location"}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 text-orange-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-400 shadow-lg z-50 max-h-72 overflow-y-auto">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationSelect(location)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-300 group"
            >
              <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white group-hover:text-orange-600 truncate transition-colors">
                {location.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {location.branch}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
