"use client";

import { stayApi } from "@/apis";
import { IProperty } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { DataListData } from "../ui/datalist/list";
import { StaysCard, StaysCardSkeleton } from "./stays-card";

const StaysList = ({ searchParams }: { searchParams: any }) => {
  const { translate } = useLanguage();
  return (
    <DataListData
      pagination
      renderEmpty={(isLoading) =>
        isLoading ? (
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(20)].map((_, index) => (
              <StaysCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[460px]">
            <span className="text-dimmed text-md text-center text-black/50">
              {translate("no_results_found", "No results found")}
            </span>
          </div>
        )
      }
      loadData={(filter) => stayApi.list(filter)}
      name="swr.properties.list.paginate"
      filters={{
        query: searchParams?.query,
        startDate: searchParams?.startDate,
        endDate: searchParams?.endDate,
        personCount: {
          min: searchParams?.personCount,
        },
        level1: searchParams?.level1,
        tags: searchParams?.tags,
        priceMin: searchParams?.priceMin,
        priceMax: searchParams?.priceMax,
        placeOffers: searchParams?.placeOffers,
      }}
    >
      {({ data }) => (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.rows.map((item: IProperty) => (
            <StaysCard payload={item} key={item._id} />
          ))}
        </div>
      )}
    </DataListData>
  );
};

export { StaysList };
