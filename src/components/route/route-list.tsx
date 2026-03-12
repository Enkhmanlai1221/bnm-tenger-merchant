import React from "react";
import { staysCardData, testCardData } from "../ui/dummy-data";
import { RouteCard } from "./route-card";
import { DataListData } from "../ui/datalist/list";
import { travelRouteApi } from "@/apis";
import { ITravelRoute } from "@/interfaces/travel-route";

const RouteList = () => {
  return (
    <DataListData
      loadData={(filter) => travelRouteApi.list(filter)}
      name="swr.travel-route.list.paginate"
    >
      {({ data }) => (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {data.rows.map((item: ITravelRoute) => (
            <RouteCard
              payload={item}
              key={item._id}
              translateY="translate-y-[190px]"
            />
          ))}
        </div>
      )}
    </DataListData>
  );
};

export { RouteList };
