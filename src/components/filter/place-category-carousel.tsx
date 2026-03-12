"use client";

import { cn } from "@/utils";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../card-carousel/buttons";
import { useLanguage } from "@/providers/language";

export function PlaceCategoryCarousel({
  data,
  currentCategory,
  onChange,
}: {
  data: any[];
  currentCategory: string[];
  onChange: (categoryId: string) => void;
}) {
  const { translate } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      containScroll: "trimSnaps",
      align: "start",
      skipSnaps: true,
    },
    [
      WheelGesturesPlugin({
        forceWheelAxis: "x",
      }),
    ],
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const isAllActive =
    currentCategory.length === 0 ||
    (currentCategory.length === 1 && currentCategory[0] === "");

  return (
    <div ref={emblaRef} className="group/carousel overflow-hidden relative">
      <div className="flex flex-row gap-x-2">
        <button
          key="all"
          className={cn(
            "group/citem flex flex-col gap-2 items-center px-2 py-2 relative min-w-[78px] w-auto flex-none hover:cursor-pointer font-medium hover:border-b-2 hover:border-gray-500",
            isAllActive ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent",
          )}
          onClick={() => {
            onChange("");
          }}
        >
          <span className="text-xs truncate">{translate("all", "All")}</span>
        </button>
        {data.map((category) => (
          <button
            key={category._id}
            className={cn(
              "group/citem flex flex-col gap-2 items-center px-2 py-2 relative min-w-[78px] w-auto flex-none hover:cursor-pointer font-medium hover:border-b-2 hover:border-gray-500",
              currentCategory.includes(category._id)
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-900 border-b-2 border-transparent",
            )}
            onClick={() => {
              onChange(category._id);
            }}
          >
            <span className="text-xs truncate">{category.name}</span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none",
          prevBtnDisabled && "hidden lg:hidden",
        )}
      />
      <div
        className={cn(
          "hidden lg:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none",
          nextBtnDisabled && "hidden lg:hidden",
        )}
      />
      <div className="hidden absolute inset-y-0 left-4 lg:flex items-center">
        <PrevButton
          onClick={(e) => {
            e.preventDefault();
            onPrevButtonClick();
          }}
          disabled={prevBtnDisabled}
          className={cn(
            "rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 p-2 hidden ring-1 ring-gray-200",
            !prevBtnDisabled && "block",
          )}
          iconClassName="w-3 h-3"
        />
      </div>
      <div className="hidden absolute inset-y-0 right-4 lg:flex items-center">
        <NextButton
          onClick={(e) => {
            e.preventDefault();
            onNextButtonClick();
          }}
          disabled={nextBtnDisabled}
          className={cn(
            "rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-300 p-2 hidden ring-2 ring-gray-500",
            !nextBtnDisabled && "block",
          )}
          iconClassName="w-3 h-3"
        />
      </div>
    </div>
  );
}
