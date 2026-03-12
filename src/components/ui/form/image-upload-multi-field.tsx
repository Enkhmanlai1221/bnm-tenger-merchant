"use client";

import { useField } from ".";
import { ImageMultiUpload } from "../multi-upload-image/upload-multi-image";
import { IconAlertCircle } from "@tabler/icons-react";

type Props = {
  label?: string;
  name: string;
  required?: boolean;
  onChange?: (value: string[]) => void;
  mainImage?: string;
  setMainImage?: (e: string) => void;
};

const ImageUploadMultiField = ({
  label,
  name,
  required,
  onChange: onChangeProp,
  mainImage,
  setMainImage,
}: Props) => {
  const { onChange, error, value } = useField(name, true);

  return (
    <div className="text-start">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${error ? "text-red-600" : "text-gray-900"}`}
        >
          {label} {!!required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative mt-2">
        <ImageMultiUpload
          onChange={(e) => {
            onChangeProp?.(e);
            onChange(e);
          }}
          value={value || []}
          mainImage={mainImage}
          setMainImage={setMainImage}
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

ImageUploadMultiField.displayName = "ImageUploadField";

export default ImageUploadMultiField;
