"use client";

import { showPlaceApi } from "@/apis";
import { IShowPlace } from "@/interfaces/show-place";
import { DataListData } from "../ui/datalist/list";
import { PlaceHoverCard } from "./places-hover-card";
import useSWR from "swr";
import { PlaceCategoryCarousel } from "../filter/place-category-carousel";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { ITableRef } from "../ui/table";
import { useRef } from "react";

const PlaceList = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const searchParamsObjParsed = qs.parse(searchParamsObj) as any;
  const router = useRouter();

  const tableRef = useRef<ITableRef>(null);

  const currentCategory = Array.isArray(searchParamsObjParsed.category)
    ? searchParamsObjParsed.category
    : [];

  const { data: categories } = useSWR(
    "swr.places.categories",
    showPlaceApi.placeCategories,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  return (
    <>
      <DataListData
        ref={tableRef}
        pagination
        loadData={(filter) => showPlaceApi.list(filter)}
        name="swr.places.list.paginate"
        filters={{
          category: currentCategory?.[0] ? currentCategory?.[0] : [],
        }}
      >
        {({ data }) => (
          <div>
            <div className="pb-6">
              <PlaceCategoryCarousel
                data={categories}
                currentCategory={currentCategory}
                onChange={(categoryId) => {
                  if (currentCategory.includes(categoryId)) {
                    router.push(
                      `${pathname}${qs.stringify(
                        {
                          ...searchParamsObjParsed,
                          category: [],
                        },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  } else {
                    router.push(
                      `${pathname}${qs.stringify(
                        {
                          ...searchParamsObjParsed,
                          category: [categoryId],
                        },
                        { addQueryPrefix: true, skipNulls: true },
                      )}`,
                    );
                  }
                }}
              />
            </div>
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {data.rows.map((item: IShowPlace) => {
                return (
                  <div key={item._id} className="flex h-[300px] lg:h-[200px]">
                    <PlaceHoverCard
                      payload={item}
                      reload={() => tableRef.current?.reload()}
                      translateY="translate-y-[220px] lg:translate-y-[120px]"
                      titleSize="text-md"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DataListData>
    </>
  );
};

export { PlaceList };
