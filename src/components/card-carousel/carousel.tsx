import { cn } from "@/utils";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Image from "next/image";
import React from "react";
import { NextButton, PrevButton, usePrevNextButtons } from "./buttons";
import { DotButton, useDotButton } from "./dots";
import { IImage } from "@/interfaces/image";
import { blurhashToDataURL } from "@/utils/request";

type PropType = {
  slides: IImage[];
  activeIndex: number;
  options?: EmblaOptionsType;
};

const CardCarousel: React.FC<PropType> = (props) => {
  const { slides, activeIndex, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      startIndex: activeIndex,
      duration: 20,
      loop: false,
      dragFree: false,
      skipSnaps: true,
      ...options,
    },
    [WheelGesturesPlugin()],
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="group/carousel flex justify-center items-center w-full relative">
      <div
        className="embla__viewport flex justify-center items-center w-full h-full"
        ref={emblaRef}
      >
        <div className="embla__container w-full h-full">
          {slides.map((slide, index) => (
            <div
              className="embla__slide flex justify-center items-center h-full relative"
              key={index}
            >
              <Image
                src={slide.thumbnail}
                alt={slide.thumbnail}
                fill
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={blurhashToDataURL(slide.blurhash)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-4">
        <PrevButton
          onClick={(e) => {
            e.preventDefault();
            onPrevButtonClick();
          }}
          disabled={prevBtnDisabled}
          className={cn(
            "rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300 p-2 opacity-0",
            !prevBtnDisabled && "group-hover/carousel:opacity-100",
          )}
          iconClassName="w-3 h-3"
        />
      </div>
      <div className="absolute top-1/2 right-4">
        <NextButton
          onClick={(e) => {
            e.preventDefault();
            onNextButtonClick();
          }}
          disabled={nextBtnDisabled}
          className={cn(
            "rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300 p-2 opacity-0",
            !nextBtnDisabled && "group-hover/carousel:opacity-100",
          )}
          iconClassName="w-3 h-3"
        />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-white",
                index === selectedIndex ? "opacity-100" : "opacity-35",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;
