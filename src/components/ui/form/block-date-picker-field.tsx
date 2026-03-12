"use client";

import React from "react";
import { DatePicker, DatePickerProps } from "@heroui/react";
import {
  parseDate,
  parseDateTime,
  parseAbsolute,
  getLocalTimeZone,
  toZoned,
  CalendarDate,
} from "@internationalized/date";
import type { DateValue } from "@react-types/calendar";
import { useField } from ".";

function toCalendarDate(value?: string): DateValue | null {
  if (!value) return null;

  try {
    return parseDate(value);
  } catch { }
  try {
    const zoned = toZoned(parseAbsolute(value, getLocalTimeZone()), getLocalTimeZone());
    return new CalendarDate(zoned.year, zoned.month, zoned.day);
  } catch { }
  try {
    const dt = parseDateTime(value);
    return new CalendarDate(dt.year, dt.month, dt.day);
  } catch { }

  return null;
}

interface BlockDatePickerFieldProps extends DatePickerProps<any> {
  name: string;
  label?: string;
}

const BlockDatePickerField = React.forwardRef<HTMLInputElement, BlockDatePickerFieldProps>(
  ({ name, label, ...props }, ref) => {
    const { onChange, error, value } = useField(name);
    const dateValue = toCalendarDate(value);

    return (
      <DatePicker
        ref={ref}
        isInvalid={!!error}
        errorMessage={error}
        value={dateValue}
        onChange={(date) => {
          if (!date) return onChange?.(null);

          const jsDate = new Date(date.year, date.month - 1, date.day);
          const isoValue = jsDate.toISOString();

          onChange?.(isoValue);
        }}
        label={label}
        variant="bordered"
        labelPlacement="outside"
        aria-label={label || name}
        {...props}
      />
    );
  }
);

BlockDatePickerField.displayName = "BlockDatePickerField";

export { BlockDatePickerField };
