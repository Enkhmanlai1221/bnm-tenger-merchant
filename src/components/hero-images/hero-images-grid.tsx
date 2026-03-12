"use client";

import { IImage } from "@/interfaces/image";
import { Button, cn } from "@heroui/react";
import { IconGridDots } from "@tabler/icons-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import FullWidthCarousel from "./carousel";
import { useLanguage } from "@/providers/language";
import { useMediaQuery } from "@/hooks/use-media-query";
import { blurhashToDataURL } from "@/utils/request";
import { Dialog, DialogPanel } from "@headlessui/react";

export function HeroImagesGrid({
  data,
}: {
  data: (IImage & { isMain: boolean })[];
}) {
  const { translate } = useLanguage();
  const matches = useMediaQuery("(max-width: 64em)");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Add effect to control HTML overflow when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
    } else {

      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
    };
  }, [activeIndex]);

  if (data.length === 0) return null;
  const wrapperHeight = matches ? 220 : 440;

  const orderedImages = [...data].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return 0;
  });

  return (
    <div className="overflow-hidden lg:rounded-2xl relative">
      {orderedImages.length === 1 && (
        <a
          className="flex justify-center cursor-pointer relative hover:brightness-50 transition-all"
          style={{ height: `${wrapperHeight}px` }}
          onClick={() => setActiveIndex(0)}
        >
          <Image
            src={orderedImages[0].url}
            alt={orderedImages[0].url}
            fill
            className="w-full h-full object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={blurhashToDataURL(orderedImages[0].blurhash)}
          />
        </a>
      )}

      {orderedImages.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-y-0">
          {orderedImages.map((item, index) => (
            <a
              key={item._id}
              className="flex cursor-pointer relative hover:brightness-50 transition-all"
              style={{ height: `${wrapperHeight}px`, minHeight: "220px" }}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={item.url}
                alt={item.url}
                fill
                className="w-full h-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurhashToDataURL(item.blurhash)}
              />
            </a>
          ))}
        </div>
      )}

      {orderedImages.length === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-y-0">
          <div
            style={{ height: `${wrapperHeight}px`, minHeight: "220px" }}
            className="col-span-1 lg:col-span-2 row-span-2"
          >
            <a
              className="flex w-full h-full cursor-pointer relative hover:brightness-50 transition-all"
              onClick={() => setActiveIndex(0)}
            >
              <Image
                src={orderedImages[0].url}
                alt={orderedImages[0].url}
                fill
                className="w-full h-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                placeholder="blur"
                blurDataURL={blurhashToDataURL(orderedImages[0].blurhash)}
              />
            </a>
          </div>
          <div className="col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2">
            {orderedImages.slice(1, 3).map((item, index) => (
              <a
                key={item._id}
                className="flex relative cursor-pointer hover:brightness-50 transition-all"
                style={{
                  height: `${Math.floor(wrapperHeight / 2) - 1}px`,
                  minHeight: "180px",
                }}
                onClick={() => setActiveIndex(index + 1)}
              >
                <Image
                  src={item.url}
                  alt={item.url}
                  fill
                  className="w-full h-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={blurhashToDataURL(item.blurhash)}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {orderedImages.length === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-y-0">
          <div
            style={{ height: `${wrapperHeight}px`, minHeight: "220px" }}
            className="col-span-1 lg:col-span-3 row-span-2"
          >
            <a
              className="flex w-full h-full cursor-pointer relative hover:brightness-50 transition-all"
              onClick={() => setActiveIndex(0)}
            >
              <Image
                src={orderedImages[0].url}
                alt={orderedImages[0].url}
                fill
                className="w-full h-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 75vw"
                placeholder="blur"
                blurDataURL={blurhashToDataURL(orderedImages[0].blurhash)}
              />
            </a>
          </div>
          <div className="col-span-1 grid grid-cols-3 lg:grid-cols-1 gap-2">
            {orderedImages.slice(1, 4).map((item, index) => (
              <a
                key={item._id}
                className="flex relative cursor-pointer hover:brightness-50 transition-all"
                style={{
                  height: `${Math.floor(wrapperHeight / 3) - 5}px`,
                  minHeight: "140px",
                }}
                onClick={() => setActiveIndex(index + 1)}
              >
                <Image
                  src={item.url}
                  alt={item.url}
                  fill
                  className="w-full h-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL={blurhashToDataURL(item.blurhash)}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {orderedImages.length > 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-y-0">
          <div
            style={{ height: `${wrapperHeight}px`, minHeight: "220px" }}
            className="col-span-1 lg:col-span-2 row-span-2"
          >
            <a
              className="flex w-full h-full cursor-pointer relative hover:brightness-50 transition-all"
              onClick={() => setActiveIndex(0)}
            >
              <Image
                src={orderedImages[0].url}
                alt={orderedImages[0].url}
                fill
                className="w-full h-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurhashToDataURL(orderedImages[0].blurhash)}
              />
            </a>
          </div>
          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-2">
            {orderedImages.slice(1, 5).map((item, index) => (
              <a
                key={item._id}
                className="flex relative cursor-pointer hover:brightness-50 transition-all"
                style={{
                  height: `${Math.floor(wrapperHeight / 2) - 4}px`,
                  minHeight: "160px",
                }}
                onClick={() => setActiveIndex(index + 1)}
              >
                <Image
                  src={item.url}
                  alt={item.url}
                  fill
                  className="w-full h-full object-cover"
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={blurhashToDataURL(item.blurhash)}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "absolute bottom-4 right-4",
          orderedImages.length > 4 ? "block" : "hidden",
        )}
      >
        <Button
          startContent={<IconGridDots size={20} />}
          onPress={() => setActiveIndex(0)}
        >
          {translate("show_all_photos", "Show all photos")}
        </Button>
      </div>

      {activeIndex !== null ? (
        <Dialog
          static
          open={false}
          onClose={() => { }}
          className="relative z-50"
        >
          <div className="fixed inset-0 w-screen overflow-y-auto bg-white">
            <div className="flex min-h-full items-center justify-center">
              <DialogPanel className="overflow-hidden">
                <FullWidthCarousel
                  slides={orderedImages.map((item) => item.url)}
                  activeIndex={activeIndex || 0}
                />
                <div className="absolute top-4 left-4">
                  <Button
                    onPress={() => {
                      setActiveIndex(null);
                    }}
                  >
                    {translate("close", "Close")}
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
