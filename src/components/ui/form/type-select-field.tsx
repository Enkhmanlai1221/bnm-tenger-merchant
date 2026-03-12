"use client";

import { cn } from "@/utils";
import { useField } from ".";

type Props = {
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
  options: { value: string; label: string }[];
};

const TypeSelectField = ({
  name,
  onChange: $onChange,
  options,
}: Props) => {
  const { onChange, error, value } = useField(name);

  return (
    <div>
      <div className="relative mt-1 rounded-md">
        <div
          className={cn(
            "flex items-center gap-2",
            error && "border-red-200",
          )}
        >
          {options.map((item) => (
            <button
              type="button"
              key={item.value}
              onClick={() => onChange(item.value)}
              className={cn(
                "w-1/2 p-2 rounded-md text-sm",
                value === item.value ? "border border-primary-600" : "border border-gray-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

TypeSelectField.displayName = "TypeSelectField";

export default TypeSelectField;
