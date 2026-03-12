"use client";
/* eslint-disable @next/next/no-img-element */
import { IProperty } from "@/interfaces/property";
import { IconMapPin, IconStar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/providers/language";
import { getCurrencies } from "@/actions/currency";

type Props = {
  payload: IProperty;
  totalAmount: number;
};

export function StaysPreCard({ payload: data, totalAmount }: Props) {
  const { currencyRate } = useLanguage();
  return (
    <Link href={`#`} className="flex flex-row gap-4 -my-2">
      <div className="flex-none h-20 w-28 relative rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/31/56/23/gobi-mirage-tourist-camp.jpg?w=900&h=500&s=1"}
          alt={data?.mainImage?.url}
          fill
          className="w-full h-auto object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className=" flex flex-col gap-1 py-2">
        <div className="text-gray-900 text-sm leading-5 truncate max-w-72">
          {data.name}
        </div>
        <p className="text-sm font-semibold text-gray-900">
          {currencyRate(totalAmount)}
        </p>
      </div>
    </Link>
  );
}
