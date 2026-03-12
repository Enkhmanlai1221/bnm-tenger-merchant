"use client";

import EmblaAutoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import { IBanner } from "@/interfaces/banner";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui/page-layout/container";

export function HeaderBannerCarousel({ data = [] }: { data: IBanner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      EmblaAutoplay({
        delay: 5000,
      }),
    ],
  );

  if (data.length === 0) return null;

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((item) => {
            return (
              <div key={item._id} className="embla__slide">
                <Link
                  href={item.link || ""}
                  target="_blank"
                  className="block h-96 relative"
                >
                  {item.image ? (
                    <Image
                      src={item.image.originalUrl}
                      alt={item.title}
                      fill
                      className="w-full object-cover"
                      priority
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
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
                        className="w-full h-full object-cover"
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
