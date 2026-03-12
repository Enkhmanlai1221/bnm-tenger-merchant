import { stayApi } from "@/apis";
import { StaysCard, StaysCardSkeleton } from "../stays/stays-card";
import { DataListData } from "../ui/datalist/list";
import { IProperty } from "@/interfaces/property";
import Button from "../ui/button/button";
import { useLanguage } from "@/providers/language";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const ZonesHomeList = ({ zones = [] }: { zones: any[] }) => {
  const router = useRouter();
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* {zones.map((z, idx) => (
        <DataListData
          key={z._id}
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
          loadData={(filter) =>
            stayApi.list({
              ...filter,
              limit: 4,
              page: 1,
              zone: z._id,
            })
          }
          name={`swr.zones.${z._id}.properties.home`}
        >
          {({ data }) =>
            data.rows.length > 0 && (
              <div
                className={`flex flex-col gap-5 ${idx === 0 ? "" : "mt-5"}`}
              >
                <div className="flex gap-x-10 items-center mb-1">
                  <h1 className="flex justify-start text-primary-600 lg:text-2xl text-xl font-medium">
                    {z.name}
                  </h1>
                  <Button
                    onClick={() => router.push("/zones")}
                    variant="light"
                    type="button"
                    className="bg-primary-50 px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-primary-600 text-sm">
                        {translate("see_more", "See more")}
                      </span>
                      <IconArrowUpRight size={18} className=" text-primary-600" />
                    </div>
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
                  {data.rows.map((item: IProperty) => (
                    <StaysCard payload={item} key={item._id} />
                  ))}
                </div>
              </div>
            )
          }
        </DataListData>
      ))} */}
    </div>
  );
};

export { ZonesHomeList };