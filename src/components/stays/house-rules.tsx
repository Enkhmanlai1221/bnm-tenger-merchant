/* eslint-disable @next/next/no-img-element */
import { IProperty } from "@/interfaces/property";
import { IconClock, IconUsers } from "@tabler/icons-react";
import dayjs from "dayjs";
import Badge from "../ui/badge/badge-icon";
import { useLanguage } from "@/providers/language";

export function HouseRules({ data }: { data: IProperty }) {
  const { translate } = useLanguage();

  const rulesData = [
    {
      backgroundColors: "blue",
      iconColor: "blue",
      icon: <IconClock size={18} />,
      title: translate("Check-in after", "Check-in after"),
      time: dayjs(data.checkInTime).format("HH:mm"),
    },
    {
      backgroundColors: "blue",
      iconColor: "blue",
      icon: <IconClock size={18} />,
      title: translate("Checkout before", "Checkout before"),
      time: dayjs(data.checkOutTime).format("HH:mm"),
    },
    {
      backgroundColors: "teal",
      iconColor: "teal",
      icon: <IconUsers size={18} />,
      title: translate("Guests maximum", "Guests maximum"),
      time: data.maxPersonCount,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {rulesData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-y-2">
            <Badge
              backgroundColors={item.backgroundColors as any}
              size={"sm"}
              radius={"full"}
              iconColor={item.iconColor as any}
            >
              {item.icon}
            </Badge>
            <div className="flex flex-col items-center">
              <span className="text-sm font-light text-gray-600 flex text-center">
                {item.title}
              </span>
              <span className="text-sm/4 font-semibold">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
