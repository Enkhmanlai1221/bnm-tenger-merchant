"use client";
import { IShowPlace } from "@/interfaces/show-place";
import { useLanguage } from "@/providers/language";
import Image from "next/image";
import Link from "next/link";

type Props = {
  payload: IShowPlace;
};

export function ShowPlaceMapCard({ payload }: Props) {
  const { translate } = useLanguage();
  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-md">
      <Link href={`/places/${payload._id}`} className="flex flex-col w-full">
        <div className="flex flex-col">
          <div className="flex h-[180px]">
            <Image
              className="rounded-xl object-cover"
              src={payload?.mainImage?.url}
              height={480}
              width={720}
              quality={90}
              alt={"img"}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ height: "auto" }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 p-2">
          <div className="text-gray-900 text-sm leading-5 truncate">
            {payload.name}
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-xs leading-tight text-gray-500">
              {translate("location", "Location")}:
            </p>
            <span className="text-xs mt-1 leading-4">
              {payload.addressString}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
