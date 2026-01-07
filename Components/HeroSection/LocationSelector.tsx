"use client";

import { useEffect, useRef } from "react";
import {
  MapPin,
  ChevronDown,
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
  locations: Location[];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onLocationSelect,
  isOpen,
  onToggle,
  locations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className="relative w-full h-12 sm:h-14">
      <button
        onClick={onToggle}
        className="w-full h-full flex items-center gap-2 px-3 sm:px-4 bg-white border border-gray-300 rounded-full hover:border-[#8B4513] transition-all duration-200 focus:outline-none"
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#8B4513';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '';
          }
        }}
        style={{
          borderColor: isOpen ? '#8B4513' : undefined
        }}
      >
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-[#8B4513] flex-shrink-0 transition-colors duration-200" />
        <div className="flex-1 text-left min-w-0">
          <span className="block text-xs text-gray-500">Location</span>
          <span className="block text-sm sm:text-base font-semibold text-gray-900 truncate">
            {selectedLocation ? `${selectedLocation.name} - ${selectedLocation.branch}` : "Where?"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-brand-primary' : 'text-gray-500'
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {locations.length > 0 ? (
            locations.map((location) => {
              const isSelected = selectedLocation?.id === location.id && 
                                 selectedLocation?.name === location.name && 
                                 selectedLocation?.branch === location.branch;
              
              return (
                <button
                  key={`${location.id}-${location.name}-${location.branch}`}
                  onClick={() => onLocationSelect(location)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 border-b border-gray-100 last:border-b-0
                    ${isSelected ? 'bg-amber-50 border-l-4 border-l-[#8B4513] rounded-r-md' : ''}`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#8B4513]' : 'text-gray-500'}`} />
                  <div>
                    <span className={`block font-medium ${isSelected ? 'text-[#8B4513]' : 'text-gray-900'}`}>
                      {location.name}
                    </span>
                    <span className={`block text-sm ${isSelected ? 'text-amber-700' : 'text-gray-600'}`}>
                      {location.branch}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-4 text-center text-sm text-gray-500">
              Loading locations...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;