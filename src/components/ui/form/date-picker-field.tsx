"use client";

import { DatePicker, DatePickerProps } from "@heroui/react";
import {
  parseAbsolute,
  parseDateTime,
  parseDate,
  getLocalTimeZone,
  CalendarDate,
  toZoned,
} from "@internationalized/date";
import type { DateValue } from "@react-types/calendar";
import { useField } from ".";
import React from "react";

interface DatePickerFieldProps extends DatePickerProps<any> {
  name: string;
  label?: string;
}

function parseToCalendarDate(value: string | null): DateValue | null {
  if (!value) return null;
  const tz = getLocalTimeZone();

  try {
    return parseDate(value);
  } catch {
    try {
      const zonedDate = toZoned(parseAbsolute(value, tz), tz);
      return new CalendarDate(zonedDate.year, zonedDate.month, zonedDate.day);
    } catch {
      try {
        const parsedDate = parseDateTime(value);
        return new CalendarDate(parsedDate.year, parsedDate.month, parsedDate.day);
      } catch {
        return null;
      }
    }
  }
}

const DatePickerField = React.forwardRef<HTMLInputElement, DatePickerFieldProps>(
  ({ name, label, ...props }, ref) => {
    const { onChange, error, value } = useField(name);
    const dateValue = parseToCalendarDate(value);

    return (
      <DatePicker
        ref={ref}
        label={label}
        variant="bordered"
        labelPlacement="outside"
        isInvalid={!!error}
        errorMessage={error}
        value={dateValue}
        onChange={(date) => onChange(date?.toString() ?? "")}
        aria-label={label || name}
        aria-labelledby={label || name}
        {...props}
      />
    );
  }
);

DatePickerField.displayName = "DatePickerField";

export { DatePickerField };
