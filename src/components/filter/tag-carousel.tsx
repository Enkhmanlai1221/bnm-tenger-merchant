"use client";

import { cn } from "@/utils";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "@/providers/language";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { usePrevNextButtons } from "../card-carousel/buttons";

export function TagCarousel({
  data = [],
  currentTags,
  onChange,
}: {
  data: any[];
  currentTags: string[];
  onChange: (tag: string) => void;
}) {
  const { translate } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (data.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {data.map((tag, idx) => {
            const isActive = currentTags.includes(tag._id);
            const isLast = idx === data.length - 1;
            return (
              <div
                key={tag._id}
                aria-pressed={isActive}
                onClick={() => onChange(tag._id)}
                className={cn(
                  "relative flex flex-col items-center justify-center cursor-pointer transition px-3 py-2 min-h-[58px] gap-0",
                  isActive
                    ? "bg-primary-50 border-primary-500 text-primary-500"
                    : "bg-white text-black hover:bg-gray-100 hover:border-primary-500 border-transparent"
                )}
              >
                <span className="w-5 h-5 flex items-center">
                  <img
                    src={isActive ? tag.selectedIcon : tag.icon}
                    alt={tag.name}
                    className="max-w-full h-auto max-h-full object-contain"
                  />
                </span>
                <span className="text-xs font-medium truncate">
                  {translate(tag.name, tag.name)}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
                )}
                {!isLast && (
                  <div className="absolute right-0 top-0 h-full w-px flex flex-col">
                    <span className="h-1/5 w-full bg-white"></span>
                    <span className="h-3/5 w-full bg-gray-200"></span>
                    <span className="h-1/5 w-full bg-white"></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!prevBtnDisabled &&
        <button
          onClick={onPrevButtonClick}
          className={cn(
            "absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 shadow p-1 transition border border-primary ml-2 flex items-center justify-center hover:bg-gray-50",
            prevBtnDisabled ? "opacity-30 pointer-events-none" : "opacity-100"
          )}
        >
          <IconChevronLeft size={18} color="#326144" />
        </button>
      }
      {!nextBtnDisabled &&
        <button
          onClick={onNextButtonClick}
          className={cn(
            "absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white/80 p-1 shadow transition border border-primary mr-2 flex items-center justify-center hover:bg-gray-50",
            nextBtnDisabled ? "opacity-30 pointer-events-none" : "opacity-100"
          )}
        >
          <IconChevronRight size={18} color="#326144" />
        </button>
      }
    </div>
  );
}
