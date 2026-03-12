/* eslint-disable @next/next/no-img-element */
import { mediaApi } from "@/apis";
import { IconPhotoScan, IconUpload } from "@tabler/icons-react";
import React from "react";

export default function ImageUploadInput({
  value,
  onChange,
  error,
  className = "",
  label,
}: {
  value?: string;
  onChange?: (url: string) => void;
  error?: string;
  className?: string;
  label?: string;
}) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await mediaApi.upload(formData);
      onChange?.(response.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <label
        className={`relative block cursor-pointer overflow-hidden rounded-md ${className}`}
      >
        {value ? (
          <div className="relative aspect-video w-full">
            <img
              src={value}
              alt="Uploaded image"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
              <IconUpload className="h-8 w-8 text-white" />
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full">
            <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed hover:border-black">
              <IconPhotoScan size={48} stroke={1} className="text-gray-400" />
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
