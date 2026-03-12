"use client";

import { stayApi } from "@/apis";
import { IProperty } from "@/interfaces/property";
import { DataListData } from "../ui/datalist/list";
import { StaysCard } from "./stays-card";

export function PlaceClaster({
  searchParams,
  bounds,
}: {
  searchParams: any;
  bounds: any;
}) {
  return (
    <DataListData
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
      }}
    >
      {({ data }) => (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mx-6">
          {data.rows.map((item: IProperty) => (
            <StaysCard payload={item} key={item._id} />
          ))}
        </div>
      )}
    </DataListData>
  );
}
