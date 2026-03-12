"use client";

import { Checkbox, CheckboxProps } from "@heroui/react";
import { useField } from "."; // таны custom hook
import React from "react";

const CheckboxField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
    label: string;
  } & CheckboxProps
>(({ name, label, ...props }, ref) => {
  const { onChange, error, value } = useField(name);

  const isSelected = value === true || value === "yes";

  const handleChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked ? "yes" : "no");
    }
  };

  return (
    <div className="group/input flex items-center" data-invalid={!!error}>
      <Checkbox
        ref={ref}
        isSelected={isSelected}
        onValueChange={handleChange}
        {...props}
      >
        <span className="block subpixel-antialiased text-small group-data-[required=true]/input:after:content-['*'] group-data-[required=true]/input:after:text-danger group-data-[required=true]/input:after:ml-0.5 group-data-[invalid=true]/input:text-danger w-full text-foreground">
          {label}
        </span>
      </Checkbox>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
});

CheckboxField.displayName = "CheckboxField";

export { CheckboxField };
