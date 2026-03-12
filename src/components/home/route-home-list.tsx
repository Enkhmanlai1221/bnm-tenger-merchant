"use client";

import { travelRouteApi } from "@/apis";
import { ITravelRoute } from "@/interfaces/travel-route";
import { RouteCard } from "../route/route-card";
import { DataListData } from "../ui/datalist/list";
import { Container } from "../ui/page-layout/container";

const RouteHomeList = () => {
  return (
    <Container>
      <DataListData
        pagination={false}
        loadData={(filter) => travelRouteApi.list(filter)}
        name="swr.travel-route.list"
      >
        {({ data }) => (
          <div className="mx-auto justify-center items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {data.rows.slice(0, 8).map((item: ITravelRoute) => (
              <RouteCard
                payload={item}
                key={item._id}
                titleSize="text-xl"
                translateY="translate-y-[175px]"
              />
            ))}
          </div>
        )}
      </DataListData>
    </Container>
  );
};

export { RouteHomeList };
