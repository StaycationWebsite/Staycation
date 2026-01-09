"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
}

const DateRangePicker = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectingCheckOut(false);
      }
    };

    // Only add listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDateRange = () => {
    if (!checkInDate && !checkOutDate) return "Add dates";

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    if (checkInDate && checkOutDate) {
      return `${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`;
    } else if (checkInDate) {
      return formatDate(checkInDate);
    }
    return "Add dates";
  };

  const handleDateClick = (dateString: string) => {
    if (!checkInDate || selectingCheckOut) {
      if (!checkInDate) {
        onCheckInChange(dateString);
        setSelectingCheckOut(true);
      } else {
        const checkIn = new Date(checkInDate);
        const selected = new Date(dateString);

        if (selected <= checkIn) {
          onCheckInChange(dateString);
          onCheckOutChange("");
          setSelectingCheckOut(true);
        } else {
          onCheckOutChange(dateString);
          setSelectingCheckOut(false);
        }
      }
    } else {
      onCheckInChange(dateString);
      onCheckOutChange("");
      setSelectingCheckOut(true);
    }
  };

  const generateCalendarForMonth = (monthOffset: number) => {
    const today = new Date();
    const year = 2026;
    const month = monthOffset;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isPast = date < todayDate;
      const isCheckIn = checkInDate === dateString;
      const isCheckOut = checkOutDate === dateString;
      const isInRange = checkInDate && checkOutDate &&
        date > new Date(checkInDate) &&
        date < new Date(checkOutDate);

      days.push({
        day,
        dateString,
        isPast,
        isCheckIn,
        isCheckOut,
        isInRange
      });
    }

    return days;
  };

  const getMonthName = (monthOffset: number) => {
    const date = new Date(2026, monthOffset, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const canGoBack = currentMonthOffset > 0;
  const canGoForward = currentMonthOffset < 11;

  const renderMonth = (monthOffset: number) => {
    const calendarDays = generateCalendarForMonth(monthOffset);

    return (
      <div className="flex-1 min-w-0">
        {/* Month Header */}
        <div className="mb-2 sm:mb-4 text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
            {getMonthName(monthOffset)}
          </h3>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1 sm:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {calendarDays.map((dayInfo, index) => {
            if (!dayInfo) {
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }

            const { day, dateString, isPast, isCheckIn, isCheckOut, isInRange } = dayInfo;

            return (
              <button
                key={dateString}
                onClick={() => !isPast && handleDateClick(dateString)}
                disabled={isPast}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  ${isPast
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "hover:border-2 hover:border-brand-primary cursor-pointer"
                  }
                  ${isCheckIn || isCheckOut
                    ? "bg-brand-primary text-white font-bold hover:bg-brand-primaryDark"
                    : isInRange
                    ? "bg-orange-100 text-gray-900"
                    : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative sm:col-span-1 h-12 sm:h-14">
      {/* Date Range Display Button - Airbnb Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500 group-hover:text-[#8B4513] transition-colors duration-200" />
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs truncate text-gray-500">When</p>
          <p className="text-sm sm:text-base font-semibold truncate text-gray-900">
            {formatDateRange()}
          </p>
        </div>
      </button>

      {/* Calendar Dropdown - Responsive Dual Month View */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-2xl z-50 p-4 sm:p-6 w-full sm:w-[680px] max-w-[95vw] sm:max-w-none max-h-[80vh] overflow-y-auto">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-700 p-2 -mx-4 sm:-mx-6 z-10">
            <button
              onClick={() => canGoBack && setCurrentMonthOffset(currentMonthOffset - 1)}
              disabled={!canGoBack}
              className={`p-2 rounded-lg transition-all ${
                canGoBack
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {checkInDate && !checkOutDate && (
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Select check-out date
              </p>
            )}

            <button
              onClick={() => canGoForward && setCurrentMonthOffset(currentMonthOffset + 1)}
              disabled={!canGoForward}
              className={`p-2 rounded-lg transition-all ${
                canGoForward
                  ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Responsive Calendar Layout */}
          <div className="flex gap-4 sm:gap-8 flex-col sm:flex-row">
            <div className="flex-1 min-w-0">
              {renderMonth(currentMonthOffset)}
            </div>
            {currentMonthOffset < 11 && (
              <div className="flex-1 min-w-0">
                {renderMonth(currentMonthOffset + 1)}
              </div>
            )}
          </div>

          {/* Clear Button */}
          {(checkInDate || checkOutDate) && (
            <button
              onClick={() => {
                onCheckInChange("");
                onCheckOutChange("");
                setSelectingCheckOut(false);
              }}
              className="w-full mt-4 sm:mt-6 py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:border-[#8B4513] transition-all duration-200 text-sm sticky bottom-0 bg-white dark:bg-gray-700"
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
