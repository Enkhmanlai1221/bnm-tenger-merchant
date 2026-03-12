"use client";

import { InputOtp, InputOtpProps } from "@heroui/react";
import React from "react";
import { useField } from ".";

const PinField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
  } & InputOtpProps
>(({ name, label, ...props }, ref) => {
  const { onChange, error, value } = useField(name);
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <InputOtp
        ref={ref}
        isInvalid={!!error}
        errorMessage={error}
        value={value}
        onValueChange={(value) => {
          onChange(value);
          props.onChange?.(value);
        }}
        label={label}
        labelPlacement="outside"
        {...props}
        className="flex gap-x-5"
      />
    </div>
  );
});

PinField.displayName = "PinField";

export { PinField };
