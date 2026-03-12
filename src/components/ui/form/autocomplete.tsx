"use client";

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/react";
import { useField } from ".";
import React from "react";

const AutocompleteField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
    options: { value: string; label: string }[];
  } & Omit<AutocompleteProps, "children">
>(({ name, label, options, ...props }, ref) => {
  const { onChange, error, value } = useField(name);
  return (
    <Autocomplete
      ref={ref}
      isInvalid={!!error}
      errorMessage={error}
      selectedKey={value}
      onSelectionChange={(e) => {
        if (!e) return;
        onChange(e);
        props.onChange?.(e as any);
      }}
      label={label}
      variant="bordered"
      labelPlacement="outside"
      defaultItems={options.map((item) => ({
        label: item.label,
        key: item.value,
      }))}
      {...props}
    >
      {(item: any) => (
        <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
});

AutocompleteField.displayName = "AutocompleteField";

export { AutocompleteField };
