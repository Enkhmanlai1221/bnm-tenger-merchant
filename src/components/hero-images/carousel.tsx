/* eslint-disable @next/next/no-img-element */
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";
import { NextButton, PrevButton, usePrevNextButtons } from "./buttons";
import { SelectedSnapDisplay, useSelectedSnapDisplay } from "./selected-snap";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

type PropType = {
  slides: string[];
  activeIndex: number;
  options?: EmblaOptionsType;
};

const FullWidthCarousel: React.FC<PropType> = (props) => {
  const { slides, activeIndex, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      startIndex: activeIndex,
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

  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi);

  // Add keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onPrevButtonClick();
      } else if (event.key === "ArrowRight") {
        onNextButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrevButtonClick, onNextButtonClick]);

  return (
    <section className="flex justify-center items-center">
      <div
        className="embla__viewport flex justify-center items-center"
        ref={emblaRef}
      >
        <div className="embla__container-zoomable max-w-7xl space-x-10">
          {slides.map((url, index) => (
            <div
              className="embla__slide flex justify-center items-center max-w-7xl max-h-[80vh]"
              key={index}
            >
              <img
                src={url}
                alt={url}
                className="max-w-full h-auto max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <SelectedSnapDisplay
          selectedSnap={selectedSnap}
          snapCount={snapCount}
        />
      </div>
      <div className="absolute top-1/2 left-4">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      </div>
      <div className="absolute top-1/2 right-4">
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
};

export default FullWidthCarousel;
