import { IUser, UserType } from "@/interfaces/user";
import {
  IconBrowserCheck,
  IconCashRegister,
  IconChartBar,
  IconChecklist,
  IconHome,
  IconInfoSquare,
  IconUserQuestion
} from "@tabler/icons-react";

export function useNavMenu(user: IUser | null) {
  const menuData = [
    // {
    //   key: "",
    //   name: "",
    //   children: [
    //     {
    //       key: "wishlist",
    //       name: "wishlist",
    //       href: "/wishlist",
    //       icon: IconBookmark,
    //     },
    //     {
    //       key: "personal_information",
    //       name: "personal_information",
    //       href: "/user-profile",
    //       icon: IconUserCog,
    //     },
    //   ],
    // },
  ];

  if (user?.type === UserType.APP_USER) {
    menuData.push({
      key: "bookings",
      name: "bookings",
      children: [
        {
          key: "bookings",
          name: "bookings",
          href: "/bookings",
          icon: IconBrowserCheck,
        },
      ],
    });
  }

  // if (user?.type === UserType.MERCHANT) {
  menuData.push({
    key: "merchant",
    name: "merchant",
    children: [
      {
        key: "profile",
        name: "Таны мэдээлэл",
        href: "/profile",
        icon: IconUserQuestion,
      },
      {
        key: "dashboard",
        name: "Хянах самбар",
        // href: "/profile",
        href: "/dashboard",
        icon: IconChartBar,
      },
      {
        key: "listings",
        name: "Гэрийн жагсаалт",
        href: "/listings",
        icon: IconHome,
      },
      {
        key: "reservations",
        name: "Захиалга",
        href: "/merchant-bookings",
        icon: IconChecklist,
      },
      {
        key: "transactions",
        name: "Гүйлгээний түүх",
        href: "/transactions",
        icon: IconCashRegister,
      },
    ],
  });
  // }

  return [menuData];
}
