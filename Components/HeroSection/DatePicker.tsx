"use client";

import { useState, useEffect } from "react";
import { DatePicker as HeroDatePicker } from "@nextui-org/date-picker";
import { parseDate, toZoned } from "@internationalized/date";

interface DatePickerProps {
  label: string;
  date: string;
  onDateChange: (date: string) => void;
}

const DatePicker = ({ label, date, onDateChange }: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<any>(null);

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

  return (
    <div className="relative">
      <HeroDatePicker
        label={label}
        value={selectedDate}
        onChange={(newDate) => {
          setSelectedDate(newDate);
          if (newDate) onDateChange(newDate.toString());
        }}
        className="w-full"
        classNames={{
          inputWrapper:
            "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md",
          input: "text-white placeholder-white/60",
        }}
      />
    </div>
  );
};

export default DatePicker;
