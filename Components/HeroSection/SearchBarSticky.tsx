"use client";

import { useState, useEffect } from "react";
import SearchButton from "./SearchButton";
import { Users } from "lucide-react";
import DatePicker from "./DatePicker";
import LocationSelector from "./LocationSelector";
import GuestSelectorModal from "./GuestSelectionModal";
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
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(false);
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

  // Hide search bar when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide search bar after scrolling 50px
      if (currentScrollY > 50) {
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

  const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <div
      className={`fixed left-0 right-0 z-40 px-3 sm:px-4 md:px-6 lg:px-8 bg-cover bg-center transition-all duration-500 ease-in-out ${
        isScrolled
          ? '-top-96 opacity-0 pointer-events-none'
          : 'top-16 opacity-100 py-8 pb-12 sm:py-12 sm:pb-16 md:py-20 md:pb-24'
      }`}
      style={{
        backgroundImage: "url('/Images/bg.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {/* Dark Overlay with transition */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
        isScrolled ? 'opacity-60' : 'opacity-100'
      }`}></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col justify-center h-full">
        {/* Title Section - only visible when not scrolled */}
        <div className={`text-center mb-6 transition-all duration-500 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mb-8'
        }`}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Find Your Perfect Haven
          </h1>
          <p className="text-base sm:text-lg text-gray-100">
            Discover comfortable stays at unbeatable prices
          </p>
        </div>

        {/* Search Card - Improved mobile responsiveness */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl transition-all duration-500 ease-in-out ${
          isScrolled ? 'p-2 sm:p-3 md:p-4' : 'p-4 sm:p-5 md:p-7'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {/* Location Selector */}
            <div className="sm:col-span-1 h-12 sm:h-14">
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  setLocationOpen(false);
                }}
                isOpen={locationOpen}
                onToggle={() => setLocationOpen(!locationOpen)}
              />
            </div>

            {/* Check In Date */}
            <div className="sm:col-span-1">
              <DatePicker
                label="Check In"
                date={checkInDate}
                onDateChange={setCheckInDate}
              />
            </div>

            {/* Check Out Date */}
            <div className="sm:col-span-1">
              <DatePicker
                label="Check Out"
                date={checkOutDate}
                onDateChange={setCheckOutDate}
              />
            </div>

            {/* Guest Selector Button */}
            <div className="sm:col-span-1">
              <button
                onClick={() => setIsGuestModalOpen(true)}
                className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 h-12 sm:h-14 hover:shadow-md"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Who
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white truncate">
                    {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </button>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2 lg:col-span-1">
              <SearchButton onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* Guest Selector Modal */}
      <GuestSelectorModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        guests={guests}
        onGuestChange={handleGuestChange}
      />

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