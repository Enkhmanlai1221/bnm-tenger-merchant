"use client";

import { Input, InputProps } from "@heroui/react";
import { useField } from ".";
import React from "react";
import { IconEyeOff } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";

const PasswordField = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    onChange?: (value: string) => void;
  } & InputProps
>(({ name, label, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
      type={isVisible ? "text" : "password"}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <IconEyeOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <IconEye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      {...props}
      required
    />
  );
});

PasswordField.displayName = "PasswordField";

export { PasswordField };
