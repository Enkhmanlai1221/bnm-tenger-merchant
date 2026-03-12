"use client";

import useEmblaCarousel from "embla-carousel-react";
import EmblaAutoplay from "embla-carousel-autoplay";

import { IBanner } from "@/interfaces/banner";
import Image from "next/image";
import Link from "next/link";

export function FooterBannerCarousel({ data = [] }: { data: IBanner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [
      EmblaAutoplay({
        delay: 5000,
      }),
    ],
  );

  if (data.length === 0) return null;

  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {data.map((item) => {
            return (
              <div
                key={item._id}
                className="flex-[0_0_100%] lg:flex-[0_0_50%] pr-4 select-none"
              >
                <Link
                  href={item.link || ""}
                  target="_blank"
                  className="embla__slide flex justify-center items-center w-full relative aspect-video"
                >
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      className="w-full h-full object-cover rounded-xl"
                      priority
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : null}

                  {item.video ? (
                    <div className="absolute inset-0">
                      <video
                        src={item.video.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ) : null}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
