"use client";

import { addToWishlist } from "@/apis/wishlist";
import { HIGHLIGHT, IProperty } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { setAuthModal } from "@/store/general-slice";
import { cn } from "@/utils";
import { message } from "@/utils/message";
import { IconHeart, IconMapPin, IconStar, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import CardCarousel from "../card-carousel/carousel";
import { useSearchParams } from "next/navigation";

type Props = {
  payload: IProperty;
  reload?: () => void;
};

export function StaysCard({ payload, reload }: Props) {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { translate, currencyRate } = useLanguage();
  const dispatch = useDispatch();
  const { data, mutate } = useSWR(
    `swr.property.thumbnail.${payload._id}`,
    () => payload,
    {
      fallbackData: payload,
    },
  );

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
      reload?.();
    } catch (err: any) {
      if (err.statusCode === 401) {
        dispatch(setAuthModal(true));
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Link
        href={`/stays/${data._id}?${searchString}`}
        className="flex flex-col w-full"
      >
        <div className="flex flex-col">
          <div className="flex h-80 lg:h-48 overflow-hidden rounded-xl relative">
            {{
              [HIGHLIGHT.NEW]: (
                <div className="absolute top-3 left-0 bg-gray-400 text-white text-center z-10 px-3 py-1 rounded-r-3xl">
                  <div className="text-sm">{translate("new", "New")}</div>
                </div>
              ),
              [HIGHLIGHT.DISCOUNTED]: (
                <div className="absolute top-3 left-0 bg-primary text-white text-center z-10 px-3 py-1 rounded-r-3xl">
                  <div className="text-sm">{translate("on_sale", "On sale")}</div>
                </div>
              ),
              [HIGHLIGHT.SPONSORED]: (
                <div className="absolute top-3 left-0 bg-yellow-400 text-black text-center z-10 px-3 py-1 rounded-r-3xl">
                  <div className="text-sm">{translate("sponsored", "Sponsored")}</div>
                </div>
              ),
            }[data?.highlight]}
            <CardCarousel
              slides={(data.images || [])
                .map((image) => ({
                  ...image,
                  isMain: data.mainImage._id === image._id,
                }))
                .sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0))}
              activeIndex={0}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-1 py-2">
            <div className="text-gray-900 text-sm leading-5 truncate font-medium">
              {data.name}
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-gray-500">
                  {data?.isOpenYearRound ?
                    <>
                      <IconSun
                        size={15}
                        className={cn(
                          "text-gray-500"
                        )}
                      />
                      <div className="text-xs truncate">
                        {translate("every_season", "Every season")}
                      </div>
                    </> :
                    <>
                      <IconStar
                        size={15}
                        className={cn(
                          data.avgRate > 0
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-500",
                        )}
                      />
                      <div className="text-xs">
                        {(data.avgRate || 0).toFixed(1)}
                      </div>
                      <div className="text-xs">
                        ({data.totalRates} {translate("reviews", "reviews")})
                      </div>
                    </>
                  }
                </div>

                <div className="flex items-center gap-1 text-[#475467]">
                  <IconMapPin size={15} />
                  <div className="text-xs truncate max-w-32">
                    {[
                      data?.level1?.name,
                      data?.level2?.name,
                      data?.level3?.name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {data.originalPrice && data.price < data.originalPrice ? (
                  <div className="flex justify-end items-center gap-1">
                    {data.originalPrice && (
                      <div className="text-gray-600 text-center font-lato text-xs font-normal line-through mt-1">
                        {currencyRate(data.originalPrice)}
                      </div>
                    )}
                    <div className="text-base font-medium text-primary truncate">
                      {currencyRate(data.price)}
                    </div>
                  </div>

                ) : (
                  <div className="text-md font-medium text-primary truncate">
                    {currencyRate(data.price)}
                  </div>
                )}
                <div className="text-xs text-gray-500 ">
                  {translate("per_night", "Per night")}
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

export const StaysCardSkeleton = () => {
  return (
    <div>
      <div className="bg-gray-200 animate-pulse flex h-80 lg:h-48 overflow-hidden rounded-xl relative" />
      <div className="flex flex-col gap-1 h-[75px] pt-3 pb-3 justify-between">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-y-1">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
          </div>
          <div className="h-5 bg-gray-200 animate-pulse rounded w-20" />
        </div>
      </div>
    </div>
  );
};
