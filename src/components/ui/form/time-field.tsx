"use client";

import { TimeInput, TimeInputProps } from "@heroui/react";
import { Time } from "@internationalized/date";
import dayjs from "dayjs";
import React from "react";
import { useField } from ".";

const TimeField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
  } & TimeInputProps
>(({ name, label, ...props }, ref) => {
  const { onChange, error, value } = useField(name);

  let dateValue = null;

  try {
    if (value) {
      dateValue = dayjs(value).format("HH:mm:ss");
    } else {
      dateValue = null;
    }
  } catch (err) {
  }

  return (
    <TimeInput
      ref={ref}
      isInvalid={!!error}
      errorMessage={error}
      hourCycle={24}
      value={
        dateValue
          ? new Time(
            parseInt(dateValue.split(":")[0], 10),
            parseInt(dateValue.split(":")[1], 10),
          )
          : null
      }
      onChange={(date) => {
        if (!date) return onChange?.(null);

        const newTimeValue = dayjs(
          `${dayjs().format("YYYY-MM-DD")}T${date.toString()}`,
        ).toISOString();

        onChange?.(newTimeValue);
        props.onChange?.(newTimeValue);
      }}
      label={label}
      variant="bordered"
      labelPlacement="outside"
      hideTimeZone
      {...props}
    />
  );
});

TimeField.displayName = "TimeField";

export { TimeField };
