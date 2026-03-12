"use client";

import { Select, SelectItem, SelectProps } from "@heroui/react";
import { useField } from ".";
import React from "react";

const SelectField = React.forwardRef<
  HTMLSelectElement,
  {
    name: string;
    onChange?: (value: string) => void;
    options: { value: string; label: string }[];
  } & Omit<SelectProps, "children">
>(({ name, label, options, ...props }, ref) => {
  const { onChange, error, value } = useField(name);
  return (
    <Select
      ref={ref}
      isInvalid={!!error}
      errorMessage={error}
      selectedKeys={value ? [String(value)] : []}
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
    >
      {options.map((item) => (
        <SelectItem key={item.value}>{item.label}</SelectItem>
      ))}
    </Select>
  );
});

SelectField.displayName = "SelectField";

export { SelectField };