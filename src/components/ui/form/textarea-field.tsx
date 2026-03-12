"use client";

import React from "react";
import { useField } from ".";
import { cn } from "@/utils";
import { IconAlertCircle } from "@tabler/icons-react";

type Props = {
  label?: string;
  name: string;
  placeholder: string;
  onChange?: (value: string) => void;
  required?: boolean;
  rows?: number;
};

const TextareaField = ({
  label,
  name,
  placeholder,
  onChange: $onChange,
  required,
  rows = 2,
}: Props) => {
  const { onChange, error, value } = useField(name);

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {label} {!!required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea
          id={name}
          placeholder={placeholder}
          value={value}
          className={cn([
            "block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-gray-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 md:text-md",
            error ? "ring-red-300 border-red-500" : "",
          ])}
          onChange={(e) => {
            onChange(e.target.value);
            $onChange && $onChange(e.target.value);
          }}
          rows={rows}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <IconAlertCircle size={20} className=" text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

TextareaField.displayName = "TextareaField";

export default TextareaField;
