"use client";

import { useState, useEffect } from "react";
import { DatePicker as HeroDatePicker } from "@nextui-org/date-picker";
import { parseDate, toZoned } from "@internationalized/date";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  label: string;
  date: string;
  onDateChange: (date: string) => void;
}

const DatePicker = ({ label, date, onDateChange }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Update selectedDate whenever `date` prop changes
  useEffect(() => {
    if (date) {
      const parsed = parseDate(date); // CalendarDate
      const zoned = toZoned(parsed, "UTC"); // ZonedDateTime
      setSelectedDate(zoned);
    } else {
      setSelectedDate(null);
    }
  }, [date]);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom styled button wrapper */}
      <div className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-[#8B4513] transition-colors duration-200 group">
        <div className="flex items-center gap-3">
          <Calendar className={`w-5 h-5 transition-colors duration-200 ${
            isHovered ? "text-[#8B4513]" : "text-gray-500"
          }`} />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-700">{label}</span>
            {date ? (
              <span className="block text-sm text-gray-900 mt-1">
                {formatDisplayDate(date)}
              </span>
            ) : (
              <span className="block text-sm text-gray-500 mt-1">Add date</span>
            )}
          </div>
        </div>
      </div>

      {/* Hidden DatePicker that opens on click */}
      <div className="absolute top-0 left-0 w-full h-full opacity-0">
        <HeroDatePicker
          value={selectedDate}
          onChange={(newDate) => {
            setSelectedDate(newDate);
            if (newDate) onDateChange(newDate.toString());
          }}
          className="w-full h-full"
          classNames={{
            base: "h-full",
            inputWrapper:
              "h-full bg-transparent border-0 shadow-none",
            input: "opacity-0 cursor-pointer",
            label: "hidden",
          }}
          variant="bordered"
          size="lg"
        />
      </div>
    </div>
  );
};

export default DatePicker;