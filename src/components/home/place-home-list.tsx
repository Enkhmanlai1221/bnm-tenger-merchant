"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useState, useCallback, useEffect } from "react";
import { PlaceHoverCard } from "../places/places-hover-card";
import { useLanguage } from "@/providers/language";

import { IShowPlace } from "@/interfaces/show-place";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Button from "../ui/button/button";

const PlaceHomeList = ({ data = [], type }: { data: IShowPlace[]; type: string }) => {
  const { translate } = useLanguage();
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (data.length === 0) return null;

  return (
    <div className="container">
      <div className="flex flex-row justify-between mb-6">
        <div className="flex gap-x-10 items-center">
          <h1 className="flex justify-start text-primary-600 lg:text-2xl text-xl font-medium">
            {translate("beautiful_places", "Beautiful places")}
          </h1>
          <Button
            onClick={() => router.push("/places")}
            variant="light"
            type="button"
            className="bg-primary-50 px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-primary-600 text-sm">
                {translate("see_more", "See more")}
              </span>
              <IconArrowUpRight size={18} className=" text-primary-600" />
            </div>
          </Button>
        </div>
        {emblaApi && (
          <div className="flex items-center gap-4">
            <a
              aria-disabled={!canScrollPrev}
              className="cursor-pointer"
              onClick={(e: any) => {
                e.stopPropagation();
                scrollPrev();
              }}
            >
              <IconArrowLeft size={30} className="text-primary-600" />
            </a>
            <a
              aria-disabled={!canScrollNext}
              onClick={(e: any) => {
                e.stopPropagation();
                scrollNext();
              }}
              className="cursor-pointer"
            >
              <IconArrowRight size={30} className="text-primary-600" />
            </a>
          </div>
        )}
      </div>
      <div
        className="relative min-h-[200px] rounded-xl overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">
          {data.slice(0, 12).map((item: IShowPlace) => {
            return (
              <div
                key={item._id}
                className="flex-[0_0_100%] lg:flex-[0_0_312px] pr-4"
              >
                <div className="flex h-[200px]">
                  <PlaceHoverCard
                    type={type}
                    payload={item}
                    translateY="translate-y-[120px]"
                    titleSize="text-md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { PlaceHomeList };
