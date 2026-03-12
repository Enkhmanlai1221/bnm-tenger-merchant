import useSWR from "swr";
import { BarChart } from "../charts/bar-chart";
import { merchantApi } from "@/apis";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function ProfitChart() {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // const { data: profitChart } = useSWR<
  //   {
  //     _id: string;
  //     profit: number;
  //   }[]
  // >(`swr.merchant.profit.chart.${accessToken}`, merchantApi.getProfitChart, {
  //   revalidateOnFocus: false,
  // });

  const profitChart = [
    {
      _id: "1",
      profit: 1000000,
    },
  ];

  if (!profitChart) return null;

  return (
    <div>
      <BarChart
        data={profitChart.map((a) => ({
          ...a,
          profit: a.profit?.toFixed(2) ?? 0,
        }))}
        index="_id"
        categories={["profit"]}
        colors={["emerald"]}
      />
    </div>
  );
}
