/* eslint-disable @next/next/no-img-element */
import { mediaApi } from "@/apis";
import { IconCheck, IconImageInPicture, IconPlus, IconTrash, IconUpload } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import Button from "../button/button";
import Loading from "../loading";
import { Tooltip } from "@heroui/react";

interface MultiImageUploadProps {
  onChange?: (e: string[]) => void;
  value?: string[];
  mainImage?: string;
  setMainImage?: (e: string) => void;
}

export function ImageMultiUpload({
  onChange,
  value,
  mainImage,
  setMainImage,
}: MultiImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      const validFiles = Array.from(files).filter((file) =>
        validTypes.includes(file.type),
      );

      if (validFiles.length === 0) {
        alert("Зөвхөн PNG, JPG, GIF, WEBP форматыг оруулна уу.");
        return;
      }

      setLoading(true);

      try {
        const uploadPromises = validFiles.map((file) => {
          const formData = new FormData();
          formData.append("file", file);

          return mediaApi
            .upload(formData)
            .then((response: any) => response.url);
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        onChange?.([...(value || []), ...uploadedUrls]);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [onChange, value],
  );

  async function onRemove(src: string) {
    onChange?.([...(value?.filter((item) => item != src) || [])]);
  }

  const isMain = mainImage || value?.[0];

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-x-2 gap-y-2  xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-4">
        {(value || []).map((src) => (
          <div key={src} className="relative group/image">
            <div className="absolute inset-0 bg-black/30" />
            <button
              type="button"
              className="block w-full h-full"
              onClick={() => {
                setMainImage?.(src);
              }}
            >
              <img
                alt={src}
                src={src}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:aspect-auto lg:h-40 group-hover/image:brightness-75 transition-all"
              />
            </button>
            <div className="absolute top-2 left-2 flex items-center justify-center gap-2">
              {isMain === src && (
                <Tooltip content="Main image">
                  <div className="inline-flex items-center justify-center rounded-lg bg-black/30 size-8 border border-white">
                    <IconCheck className="size-6 text-white" />
                  </div>
                </Tooltip>
              )}
              <Button
                onClick={() => {
                  onRemove(src);
                }}
                className="rounded-full bg-black/30 size-8 group/x relative"
                size="xs"
              >
                <span aria-hidden="true" className="absolute inset-0" />
                <IconTrash className="size-6 text-white group-hover/x:text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <label className="flex cursor-pointer justify-center items-center group relative aspect-square w-full rounded-md border border-dashed border-gray-200 object-cover hover:bg-white hover:border hover:border-black lg:aspect-auto lg:h-40">
          {loading ? (
            <Loading />
          ) : (
            <IconUpload className="size-12 text-gray-400" />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/gif,image/webp"
            multiple
            onChange={onUpload}
          />
        </label>
      </div>
    </div>
  );
}
