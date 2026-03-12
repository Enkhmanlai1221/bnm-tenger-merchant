"use client";

import { Input, InputProps } from "@heroui/react";
import { useField } from ".";
import React from "react";

export const TextField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
  } & InputProps
>(({ name, label, ...props }, ref) => {
  const { onChange, error, value } = useField(name);
  return (
    <Input
      ref={ref}
      isInvalid={!!error}
      errorMessage={error}
      value={value}
      name={name}
      onChange={(e) => {
        onChange(e.target.value);
        props.onChange?.(e.target.value);
      }}
      label={label}
      variant="bordered"
      labelPlacement="outside"
      classNames={{
        base: "justify-start",
      }}
      {...props}
    />
  );
});

TextField.displayName = "TextField";
