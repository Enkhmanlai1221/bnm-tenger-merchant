"use client";
import { wishlistApi } from "@/apis";
import { PlaceHoverCard } from "@/components/places/places-hover-card";
import { StaysCard } from "@/components/stays/stays-card";
import { DataListData } from "@/components/ui/datalist/list";
import { Container } from "@/components/ui/page-layout/container";
import { IWishlist } from "@/interfaces/wishlist";
import { useRef, useState } from "react";
import { useLanguage } from "@/providers/language";
import { cn } from "@heroui/react";
import { ITableRef } from "@/components/ui/table";

export default function WishlistPage() {
  const { translate } = useLanguage();
  const [onTab, setOnTab] = useState<string>("ALL");
  const tableRef = useRef<ITableRef>(null);

  const options = [
    { label: translate("all", "All"), value: "ALL" },
    { label: translate("stays", "Stays"), value: "PROPERTY" },
    { label: translate("beautiful_place", "Beautiful place"), value: "SHOW_PLACE" },
  ];

  return (
    <Container>
      <h1 className="flex text-2xl font-semibold my-4">
        {translate("wishlist", "Wishlist")}
      </h1>
      <div className="flex gap-2 mb-4">
        {options.map((i) => (
          <button
            key={i.value}
            onClick={() => setOnTab(i.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              onTab === i.value
                ? "bg-primary-500 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            )}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        <DataListData
          ref={tableRef}
          pagination={false}
          filters={{
            type: onTab === "ALL" ? undefined : onTab,
          }}
          loadData={(filter) => wishlistApi.list(filter)}
          name="swr.wishlist.list.paginate"
        >
          {({ data }) => (
            <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.rows.map((item: IWishlist) => {
                if (item.property) {
                  return <StaysCard payload={item.property} key={item._id} reload={() => tableRef.current?.reload()} />;
                }
                if (item.showPlace) {
                  return (
                    <div key={item._id} className="flex h-[200px]">
                      <PlaceHoverCard
                        reload={() => tableRef.current?.reload()}
                        payload={item.showPlace}
                        translateY="translate-y-[120px]"
                        titleSize="text-md"
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </DataListData>
      </div>
    </Container>
  );
}
