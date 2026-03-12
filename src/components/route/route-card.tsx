import Image from "next/image";
import React from "react";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { ITravelRoute } from "@/interfaces/travel-route";
import { useLanguage } from '@/providers/language';

type Props = {
  payload: ITravelRoute;
  onPress?: () => void;
  titleSize?: string;
  translateY?: string;
};

const RouteCard = ({ payload, onPress, titleSize, translateY }: Props) => {
  const { translate } = useLanguage();
  return (
    <Link href={`/travel-routes/${payload._id}`}>
      <div className="flex group relative rounded-xl overflow-hidden shadow-lg h-full w-full">
        <div className="flex h-80">
          <Image
            className="object-cover"
            src={payload.mainImage.url}
            quality={90}
            alt={"img"}
            priority
            width={720}
            height={480}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ height: "auto" }}
          />
        </div>
        <div className="group absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
          <div
            className={`absolute transform inset-0  ${translateY || "translate-y-[255px]"} group-hover:translate-y-0 transition-transform duration-500 flex h-full`}
          >
            <div className="w-full flex flex-col bg-gradient-to-t from-black to-transparent justify-between px-3 py-4 ">
              <div>
                <div className="flex items-start gap-3 justify-between">
                  <div
                    className={`text-white  ${titleSize || "text-2xl"} font-semibold line-clamp-2 leading-tight`}
                  >
                    {payload.name}
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 w-0 h-0 group-hover:w-6 group-hover:h-6 mt-1">
                    <IconArrowUpRight size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col opacity-100 group-hover:opacity-0 transition-opacity duration-300 mt-1">
                  {payload.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="text-white text-sm font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm text-white leading-tight font-light line-clamp-6">
                  {payload.description}
                </p>
                <div className="flex justify-between">
                  <p className="text-sm text-white leading-tight font-light mr-3">
                    Location:
                  </p>
                  <span className="text-sm text-white leading-tight font-light line-clamp-2">
                    {payload.places.map((place) => place.place.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export { RouteCard };
