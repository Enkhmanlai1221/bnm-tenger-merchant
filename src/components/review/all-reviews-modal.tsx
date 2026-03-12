/* eslint-disable @next/next/no-img-element */
"use client";

import { IconStarFilled, IconX } from "@tabler/icons-react";
import { ReviewItem } from "./review-item";
import { IReview } from "@/interfaces/review";
import { reviewApi } from "@/apis";
import { DataListData } from "../ui/datalist/list";
import { useLanguage } from "@/providers/language";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AllReviewsModal = ({
  properyId,
  onClose,
}: {
  properyId: string;
  onClose: () => void;
}) => {
  const { translate } = useLanguage();
  return (
    <div className="bg-white">
      <DataListData
        name={`swr.reviews.${properyId}`}
        loadData={(filters) =>
          reviewApi.list({ property: properyId, ...filters })
        }
      >
        {({ data }) => {
          const rateValues = data?.rows?.map(
            (item: { rate: number }) => item.rate,
          );
          const totalRatings = rateValues.length;
          const averageRating =
            rateValues.reduce((sum: any, rate: any) => sum + rate, 0) /
            totalRatings;
          const ratingDistribution = [1, 2, 3, 4, 5].map((star) => {
            const count = rateValues.filter(
              (rate: number) => rate === star,
            ).length;
            return {
              stars: star,
              count: count,
              percentage: count / totalRatings,
            };
          });
          return (
            <div className="mx-auto max-w-xl lg:max-w-6xl  lg:grid lg:grid-cols-3 gap-x-4 h-[70vh]">
              <div className="lg:col-span-1 md:bg-gray-50 p-4 h-full">
                <button onClick={onClose} className="w-full">
                  <IconX />
                </button>
                <div className="mt-5">
                  <div className="md:flex justify-center hidden">
                    <img src="/rating-star.svg" alt="" className="w-60 h-60" />
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 ">
                    {translate("overall_rating", "Overall rating")}
                  </h2>
                  <div className="mt-3 flex items-center">
                    <div>
                      <div className="flex items-center gap-x-1">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <IconStarFilled
                            size={20}
                            key={rating}
                            className={classNames(
                              averageRating > rating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "shrink-0",
                            )}
                          />
                        ))}
                      </div>
                      <p className="sr-only">
                        {translate("out_of_5_stars", "out of 5 stars")}
                      </p>
                    </div>
                    <p className="ml-2 text-sm text-gray-900">
                      {translate("based_on", "Based on")} {totalRatings}{" "}
                      {translate("reviews", "reviews")}
                    </p>
                  </div>
                  <div className="mt-6">
                    <dl className="space-y-1">
                      {ratingDistribution.map((item) => (
                        <div
                          key={item.stars}
                          className="flex items-center text-sm"
                        >
                          <dt className="flex flex-1 items-center">
                            <p className="w-3 font-medium text-gray-900">
                              {item.stars}
                              <span className="sr-only">
                                {translate("star_reviews", "star reviews")}
                              </span>
                            </p>
                            <div
                              aria-hidden="true"
                              className="ml-1 flex flex-1 items-center"
                            >
                              <div className="relative ml-3 flex-1">
                                <div className="h-2.5 rounded-full border border-gray-200 bg-gray-100" />
                                {item.count > 0 ? (
                                  <div
                                    style={{
                                      width: `calc(${item.percentage}  * 100%)`,
                                    }}
                                    className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                  />
                                ) : null}
                              </div>
                            </div>
                          </dt>
                          <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                            {item.percentage ? (
                              <> {Math.round(item.percentage * 100)}%</>
                            ) : (
                              "0%"
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 lg:mt-0 px-4 py-10 h-full overflow-y-auto">
                <div className="grid grid-cols-1 gap-5 ">
                  {(data?.rows || []).map((review: any, index: number) => {
                    return (
                      <div key={index}>
                        <ReviewItem payload={review} disableEllipsis />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }}
      </DataListData>
    </div>
  );
};
export { AllReviewsModal };
