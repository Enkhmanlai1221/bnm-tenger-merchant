"use client";

import { cn } from "@/utils";
import { useField } from "./index";
import React from "react";

interface TextField2Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextField2 = React.forwardRef<HTMLInputElement, TextField2Props>(
  ({ name, label, onChange: propOnChange, ...props }, ref) => {
    const { onChange: fieldOnChange, error, value } = useField(name);
    return (
      <div>
        <input
          ref={ref}
          id={name}
          name={name}
          value={value || ""}
          onChange={(e) => fieldOnChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            error
              ? "border-red-300 text-red-900 placeholder-red-300"
              : "border-gray-300 text-gray-900 placeholder-gray-400",
            props.className,
          )}
          {...props}
        />
      </div>
    );
  },
);

TextField2.displayName = "TextField2";
