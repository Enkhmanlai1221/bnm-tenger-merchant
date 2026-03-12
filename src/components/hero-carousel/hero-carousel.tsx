import { IImage } from "@/interfaces/image";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import "./style.css";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export function HeroCarousel({
  data,
  options,
}: {
  data: IImage[];
  options?: EmblaOptionsType;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="overflow-hidden rounded-4xl">
      <div className="embla-th">
        <div className="embla-th__viewport" ref={emblaMainRef}>
          <div className="embla-th__container">
            {data.map((item) => (
              <div
                className="embla-th__slide rounded-xl overflow-hidden h-[720px]"
                key={item._id}
              >
                <Image
                  src={item.url}
                  alt={item.url}
                  width={1800}
                  height={900}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="embla-th-thumbs flex flex-row items-center justify-between">
          <button
            className="embla-th-thumbs__button"
            onClick={() => emblaMainApi?.scrollPrev()}
          >
            <IconChevronLeft />
          </button>
          <div className="embla-th-thumbs__viewport" ref={emblaThumbsRef}>
            <div className="embla-th-thumbs__container">
              {data.map((item, index) => (
                <button
                  onClick={() => onThumbClick(index)}
                  className={"embla-th-thumbs__slide".concat(
                    selectedIndex === index
                      ? " embla-th-thumbs__slide--selected"
                      : "",
                  )}
                  key={item._id}
                >
                  <div className="embla-th-thumbs__slide__number">
                    <Image
                      className="object-cover w-full h-32"
                      src={item.url}
                      alt={item.url}
                      width={160}
                      height={80}
                      priority
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button
            className="embla-th-thumbs__button"
            onClick={() => emblaMainApi?.scrollNext()}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
