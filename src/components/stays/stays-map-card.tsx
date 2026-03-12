"use client";
import { addToWishlist } from "@/apis/wishlist";
import { IProperty } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { setAuthModal } from "@/store/general-slice";
import { cn } from "@/utils";
import { message } from "@/utils/message";
import { IconHeart, IconMapPin, IconStar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import useSWR from "swr";
type Props = {
  payload: IProperty;
};

export function StaysMapCard({ payload }: Props) {
  const { translate, currencyRate } = useLanguage();
  const dispatch = useDispatch();
  const { data, mutate } = useSWR(
    `swr.property.thumbnail.${payload._id}`,
    () => payload,
  );

  if (!data) return null;
  const handleAddToWishlist = async (propertyId: string) => {
    try {
      await addToWishlist(propertyId);
      message.success(
        data?.isSaved
          ? translate("removed_from_wishlist", "Removed from wishlist")
          : translate("added_to_wishlist", "Added to wishlist"),
      );
      mutate(
        { ...data, isSaved: !data.isSaved },
        {
          revalidate: false,
        },
      );
    } catch (err: any) {
      if (err.statusCode === 401) {
        dispatch(setAuthModal(true));
      }
      message.error(translate("unauthorized_error", "Unauthorized error"));
    }
  };
  return (
    <div className="relative overflow-hidden bg-white rounded-lg">
      <Link href={`/stays/${data._id}`} className="flex flex-col w-full">
        <div className="flex justify-center items-center h-48 relative">
          <Image
            src={data?.mainImage?.url}
            alt={data?.mainImage?.url}
            fill
            className="w-full h-auto object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="px-2">
          <div className="flex flex-col gap-1 py-2">
            <div className="text-gray-900 text-sm leading-5 truncate">
              {data.name}
            </div>
            <div className="flex items-start justify-between">
              <div className="leading-5">
                <div className="flex items-center gap-x-1 text-gray-500">
                  <IconStar
                    size={15}
                    className={cn(
                      data.avgRate > 0
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-500",
                    )}
                  />
                  {data.totalRates > 0 ? (
                    <>
                      <div className="text-xs">
                        {(data.avgRate || 0).toFixed(1)}
                      </div>
                      <div className="text-xs">
                        ({data.totalRates} {translate("reviews", "reviews")})
                      </div>
                    </>
                  ) : (
                    <div className="text-xs">{translate("new", "New")}</div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <IconMapPin size={15} />
                  <div className="text-xs truncate max-w-32">
                    {data?.level1?.name}, {data?.level2?.name},
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-md font-medium text-gray-900 truncate">
                  {currencyRate(data.price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        className="rounded-full absolute top-2 right-2"
        onClick={() => handleAddToWishlist(data._id)}
      >
        {data.isSaved ? (
          <>
            <div className="group">
              <div className="text-white p-2 rounded-full transition-transform duration-300 ease-in-out transform group-hover:scale-150 ">
                <IconHeart
                  className="w-7 h-7"
                  stroke={1.5}
                  fill="red"
                  fillOpacity={0.8}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="group">
            <div className="text-white p-2 rounded-full transition-transform duration-300 ease-in-out transform group-hover:scale-150">
              <IconHeart
                className="w-7 h-7"
                stroke={1.5}
                fill="dark"
                fillOpacity={0.3}
              />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
