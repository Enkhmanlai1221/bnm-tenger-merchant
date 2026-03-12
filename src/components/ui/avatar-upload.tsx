import { mediaApi } from "@/apis";
import {
  IconUser,
  IconUpload,
  IconLoader2,
} from "@tabler/icons-react";
import React from "react";

export default function AvatarUpload({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange?: (url: string) => void;
  error?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await mediaApi.upload(formData);
      onChange?.(response.url);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 h-full">
      <label className="relative block h-full w-full cursor-pointer overflow-hidden rounded-full">
        {!loading ? (
          <>
            {value ? (
              <div className="relative h-full w-full">
                <img
                  src={value}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                  <IconUpload className="h-8 w-8 text-white" />
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <div className="flex h-full w-full items-center justify-center bg-gray-100 ">
                  <IconUser size={68} stroke={1} className="text-gray-400" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                  <IconUpload size={68} stroke={1} className="text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative h-full w-full">
            <div className="flex h-full w-full items-center justify-center bg-gray-100 animate-spin">
              <IconLoader2 size={68} stroke={1} className="text-gray-400" />
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
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
