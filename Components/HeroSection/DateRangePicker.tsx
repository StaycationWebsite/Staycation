"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateSafe } from "@/lib/dateUtils";

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
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 450; // approximate max height
      
      // Determine if there's enough space below, else open above
      const spaceBelow = viewportHeight - rect.bottom;
      const openAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      
      setDropdownPosition({
        top: openAbove 
          ? rect.top + window.scrollY - dropdownHeight - 8 
          : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside trigger button AND outside portal content
      const target = event.target as Node;
      const portalContent = document.getElementById('calendar-portal-content');
      
      if (
        containerRef.current && 
        !containerRef.current.contains(target) && 
        (!portalContent || !portalContent.contains(target))
      ) {
        setIsOpen(false);
        setSelectingCheckOut(false);
        setHoveredDate(null);
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

    if (checkInDate && checkOutDate) {
      return `${formatDateSafe(checkInDate)} - ${formatDateSafe(checkOutDate)}`;
    } else if (checkInDate) {
      return formatDateSafe(checkInDate);
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
          setHoveredDate(null);
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
      // Create date string in local time to avoid timezone shift
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = date < todayDate;
      const isCheckIn = checkInDate === dateString;
      const isCheckOut = checkOutDate === dateString;
      const isInRange = checkInDate && checkOutDate &&
        date > new Date(checkInDate) &&
        date < new Date(checkOutDate);

      // Check if date should be in hover range
      let isHoveredRange = false;
      if (checkInDate && hoveredDate && !checkOutDate) {
        const hoverDate = new Date(hoveredDate);
        const checkIn = new Date(checkInDate);
        if (date > checkIn && date < hoverDate) {
          isHoveredRange = true;
        }
      }

      days.push({
        day,
        dateString,
        isPast,
        isCheckIn,
        isCheckOut,
        isInRange,
        isHoveredRange
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

            const { day, dateString, isPast, isCheckIn, isCheckOut, isInRange, isHoveredRange } = dayInfo;

            // Determine if this date should show hover effect
            const isHovered = hoveredDate === dateString;
            const shouldShowHover = !isPast && !isCheckIn && !isCheckOut && !isInRange && !isHoveredRange;

            return (
              <button type="button"
                key={dateString}
                onClick={() => !isPast && handleDateClick(dateString)}
                onMouseEnter={() => !isPast && setHoveredDate(dateString)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isPast}
                className={`
                  aspect-square w-full h-full flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                  relative
                  ${isPast
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                    : "cursor-pointer"
                  }
                  ${isCheckIn || isCheckOut
                    ? "bg-brand-primary text-white font-bold z-10"
                    : isInRange || isHoveredRange
                    ? "bg-orange-100 dark:bg-orange-900/30 text-gray-900 dark:text-white"
                    : ""
                  }
                  ${shouldShowHover
                    ? "hover:bg-gray-100 dark:hover:bg-gray-600"
                    : ""
                  }
                  ${isHovered && !isCheckIn && !isCheckOut
                    ? "ring-2 ring-brand-primary ring-offset-2"
                    : ""
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
      <button type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center gap-2 px-3 sm:px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:border-[#8B4513] transition-all duration-200 focus:outline-none"
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
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-[#8B4513] transition-colors duration-200" />
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs truncate text-gray-500 dark:text-gray-400">When</p>
          <p className="text-sm sm:text-base font-semibold truncate text-gray-900 dark:text-white">
            {formatDateRange()}
          </p>
        </div>
      </button>

      {/* Calendar Dropdown - Responsive Dual Month View */}
      {isOpen && createPortal(
        <div 
          id="calendar-portal-content"
          className="absolute mt-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-2xl z-[10000] p-4 sm:p-6 w-full sm:w-[680px] max-w-[95vw] max-h-[80vh] overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-700 p-2 -mx-4 sm:-mx-6 z-10">
            <button type="button"
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

            <button type="button"
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
            <button type="button"
              onClick={() => {
                onCheckInChange("");
                onCheckOutChange("");
                setSelectingCheckOut(false);
                setHoveredDate(null);
              }}
              className="w-full mt-4 sm:mt-6 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-medium hover:border-[#8B4513] transition-all duration-200 text-sm sticky bottom-0"
            >
              Clear dates
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DateRangePicker;