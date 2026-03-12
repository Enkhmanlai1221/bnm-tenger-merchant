import useSWR from "swr";
import { BarChart } from "../charts/bar-chart";
import { merchantApi } from "@/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLanguage } from "@/providers/language";
import dayjs from "dayjs";
export function OrderChart() {
  const { translate, currencyRate } = useLanguage();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  // const { data: orderChart } = useSWR<
  //   {
  //     list: {
  //       _id: string;
  //       totalAmount: number;
  //       totalBookings: number;
  //     }[];
  //     mapped: {
  //       [key: string]: {
  //         totalAmount: number;
  //         totalBookings: number;
  //       };
  //     };
  //   },
  //   Error
  // >(
  //   `swr.merchant.order.chart.${accessToken}`,
  //   async () => {
  //     const res: any[] = await merchantApi.getOrderChart(accessToken);
  //     return {
  //       list: res,
  //       mapped: res.reduce((acc, item) => {
  //         acc[item._id] = {
  //           totalAmount: item.totalAmount,
  //           totalBookings: item.totalBookings,
  //         };
  //         return acc;
  //       }, {}),
  //     };
  //   },
  //   {
  //     revalidateOnFocus: false,
  //   },
  // );

  const orderChart = {
    list: [
      {
        _id: "1",
        totalAmount: 1000000,
        totalBookings: 1000000,
      },
    ],
    mapped: {
      "1": {
        totalAmount: 1000000,
        totalBookings: 1000000,
      },
    },
  };

  if (!orderChart) return null;

  return (
    <div>
      <BarChart
        data={orderChart.list}
        index="_id"
        categories={["totalAmount"]}
        colors={["emerald"]}
        customTooltip={(tooltipCallbackContent) => {
          return (
            <div className="bg-white p-4 rounded-md flex flex-col gap-y-2 shadow-lg">
              <div className="flex gap-1">
                <span>
                  {dayjs(tooltipCallbackContent?.label?.split("@")[0]).format(
                    "YYYY",
                  )}
                </span>
                <span>
                  {dayjs(tooltipCallbackContent?.label?.split("@")[1]).format(
                    "MMMM",
                  )}{" "}
                </span>
              </div>
              <div>
                {tooltipCallbackContent.payload.map((item) => (
                  <div key={item.category}>
                    <div className="flex gap-x-4 justify-between">
                      <div className="text-sm">
                        {translate(
                          `order_chart_${item.category}`,
                          item.category,
                        )}
                      </div>
                      <div className="text-sm font-bold text-right">
                        {currencyRate(item.value)}
                      </div>
                    </div>
                    <div className="flex gap-x-4 justify-between">
                      <div className="text-sm">
                        {translate(
                          `order_chart_totalBookings`,
                          "totalBookings",
                        )}
                      </div>
                      <div className="text-sm font-bold text-right">
                        {orderChart.mapped[item.index as keyof typeof orderChart.mapped].totalBookings}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div >
  );
}
