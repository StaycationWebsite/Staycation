"use client";

import { useState, useEffect } from "react";
import SearchButton from "./SearchButton";
import DateRangePicker from "./DateRangePicker";
import LocationSelector from "./LocationSelector";
import GuestSelector from "./GuestSelector";
import StayTypeSelectorModal from "./StayTypeSelectorModal";
import ValidationModal from "./ValidationModal";
import { useRouter } from "next/navigation";
import {
  setLocation as setReduxLocation,
  setCheckInDate as setReduxCheckInDate,
  setCheckOutDate as setReduxCheckOutDate,
  setGuests as setReduxGuests,
  setIsFromSearch,
} from '@/redux/slices/bookingSlice'
import { useAppDispatch } from "@/redux/hooks";

interface StayType {
  id: string;
  duration: string;
  price: string;
  description: string;
}

interface Location {
  id: number;
  name: string;
  branch: string;
}

interface Guests {
  adults: number;
  children: number;
  infants: number;
}

const SearchBarSticky = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [isStayTypeModalOpen, setIsStayTypeModalOpen] = useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [selectedStay, setSelectedStay] = useState<StayType | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [guests, setGuests] = useState<Guests>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/haven`, { cache: 'no-cache' });
        if (res.ok) {
          const response = await res.json();
          const havens = response?.data || [];

          // Extract unique locations (haven_name + tower)
          const uniqueLocations = havens.reduce((acc: Location[], haven: {
            id?: number;
            haven_name?: string;
            tower?: string;
          }) => {
            const locationKey = `${haven.haven_name}-${haven.tower}`;
            const exists = acc.find(loc => `${loc.name}-${loc.branch}` === locationKey);

            if (!exists && haven.haven_name && haven.tower) {
              acc.push({
                id: haven.id || acc.length + 1,
                name: haven.haven_name,
                branch: haven.tower
              });
            }
            return acc;
          }, []);

          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Make search bar compact when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Make search bar compact after scrolling 100px
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGuestChange = (type: keyof Guests, value: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const calculateDaysDifference = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    // Validation checks
    const missingFields: string[] = [];

    if (!selectedLocation) {
      missingFields.push("location");
    }
    if (!checkInDate) {
      missingFields.push("check-in date");
    }
    if (!checkOutDate) {
      missingFields.push("check-out date");
    }

    if (missingFields.length > 0) {
      let message = "Please select ";
      if (missingFields.length === 1) {
        message += `a ${missingFields[0]}.`;
      } else if (missingFields.length === 2) {
        message += `${missingFields[0]} and ${missingFields[1]}.`;
      } else {
        message += `${missingFields[0]}, ${missingFields[1]}, and ${missingFields[2]}.`;
      }

      setValidationMessage(message);
      setIsValidationModalOpen(true);
      return;
    }

    //Save to redux before opening modal
    dispatch(setReduxLocation(selectedLocation));
    dispatch(setReduxCheckInDate(checkInDate));
    dispatch(setReduxCheckOutDate(checkOutDate));
    dispatch(setReduxGuests(guests));
    dispatch(setIsFromSearch(true))

    // All fields are valid, proceed
    setIsStayTypeModalOpen(true);
  }

  return (
    <div
      className={`fixed left-0 right-0 z-40 w-full transition-all duration-500 ease-in-out bg-gray-50 dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 ${
        isScrolled
          ? 'top-16 py-3'
          : 'top-16 py-6 sm:py-8 md:py-10'
      }`}
    >
      {/* Search Card - Airbnb Style */}
      <div className={`max-w-6xl mx-auto transition-all duration-500 ease-in-out ${
        isScrolled ? 'px-4' : 'px-4 sm:px-6'
      }`}>
        <div className={`bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 ${
          isScrolled ? 'p-2' : 'p-3'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 items-center">
            {/* Location Selector */}
            <div className="relative px-4 py-2 border-r border-gray-200 dark:border-gray-700">
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  setLocationOpen(false);
                }}
                isOpen={locationOpen}
                onToggle={() => setLocationOpen(!locationOpen)}
                locations={locations}
              />
            </div>

            {/* Date Range Picker - Check In & Check Out */}
            <div className="relative px-4 py-2 border-r border-gray-200 dark:border-gray-700">
              <DateRangePicker
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInChange={setCheckInDate}
                onCheckOutChange={setCheckOutDate}
              />
            </div>

            {/* Guest Selector */}
            <div className="relative px-4 py-2 border-r border-gray-200 dark:border-gray-700">
              <GuestSelector
                guests={guests}
                onGuestChange={handleGuestChange}
              />
            </div>

            {/* Search Button */}
            <div className="relative px-4 py-2 flex items-center justify-center">
              <SearchButton onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      <StayTypeSelectorModal
        isOpen={isStayTypeModalOpen}
        onClose={() => setIsStayTypeModalOpen(false)}
        selectedStay={selectedStay}
        onSelectStay={setSelectedStay}
        daysDifference={calculateDaysDifference(checkInDate, checkOutDate)}
        router={router}
      />

      {/* Validation Modal */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        message={validationMessage}
      />
    </div>
  );
};

export default SearchBarSticky;