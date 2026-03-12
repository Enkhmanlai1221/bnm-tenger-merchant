import React, { useRef, useState } from "react";
import { useField } from ".";
import { cn } from "@/utils";

type Props = {
  name: string;
  length?: number;
  label?: string;
  required?: boolean;
};

const OtpField = ({ label, required, name, length = 4 }: Props) => {
  const { value, error, onChange } = useField(name);
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [values, setValues] = useState<string[]>(
    (value || "")?.split("") || [],
  );

  const onChangeValue = (input: string, index: number) => {
    const newPin = [...values];
    newPin[index] = input;

    setValues(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      onChange(newPin.join(""));
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {label} {!!required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`flex justify-between mt-1 gap-1`}>
        {Array.from({ length }, (_, index) => (
          <input
            ref={(ref) => {
              inputRef.current[index] = ref as HTMLInputElement;
            }}
            key={index}
            type="text"
            maxLength={1}
            value={values && values[index]}
            onChange={(e) => onChangeValue(e.target.value, index)}
            className={cn([
              "w-[50px] rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-gray-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 md:text-lg text-center",
              error ? "ring-red-300 border-red-500" : "",
            ])}
          />
        ))}
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

OtpField.displayName = "OtpField";

export default OtpField;
