import { stayApi } from "@/apis";
import { IProperty } from "@/interfaces/property";
import { StaysCard, StaysCardSkeleton } from "../stays/stays-card";
import { DataListData } from "../ui/datalist/list";

const StaysHomeList = () => {
  return (
    <DataListData
      renderEmpty={(isLoading) =>
        isLoading ? (
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <StaysCardSkeleton key={index} />
            ))}
          </div>
        ) : null
      }
      limit={16}
      pagination={false}
      loadData={(filter) => stayApi.list(filter)}
      name="swr.properties.home"
    >
      {({ data }) => (
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
          {data.rows.map((item: IProperty) => (
            <StaysCard payload={item} key={item._id} />
          ))}
        </div>
      )}
    </DataListData>
  );
};
export { StaysHomeList };
