import { Suspense } from "react";
import { DesktopSearchBar } from "./desktop-search";
import { MobileSearchBar } from "./mobile-search";
import { DataListData } from "../ui/datalist/list";
import { bannerApi } from "@/apis";
import { HeaderBannerCarousel } from "../home/header-banner";

export function SearchBar() {

  const SearchInputs = () => (
    <>
      <div className="hidden md:block">
        <DesktopSearchBar />
      </div>
      <div className="block md:hidden">
        <MobileSearchBar />
      </div>
    </>
  );

  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-lg" />}>
      <DataListData
        pagination={false}
        loadData={() => bannerApi.list({ type: "HEADER" })}
        name="swr.banner.header.list.paginate"
        type="banner"
      >
        {({ data }) => {
          const hasBanner = data.rows.length > 0;
          return (
            <div className="relative w-full">
              {hasBanner &&
                <HeaderBannerCarousel data={data.rows} />
              }
              <div className={hasBanner ? "absolute inset-x-0 bottom-0" : "mt-6"}>
                <div className={hasBanner ? "container relative pb-6" : "container relative"}>
                  <SearchInputs />
                </div>
              </div>
            </div>
          );
        }}
      </DataListData>
    </Suspense>
  );
}
