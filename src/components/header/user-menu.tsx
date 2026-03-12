"use client";

import { authApi } from "@/apis";
import { useNavMenu } from "@/hooks/use-nav-menu";
import { UserType } from "@/interfaces/user";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { logout } from "@/store/auth-slice";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import {
  IconChevronDown,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const UserMenu = () => {
  const { translate, lang } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const onLogout = async () => {
    await authApi.logout();
    dispatch(logout());
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.push("/");
  };

  const [userMenuData] = useNavMenu(user);

  const username =
    user?.firstName || user?.lastName
      ? `${user?.firstName || ""} ${user?.lastName || ""}`
      : user?.email;

  return (
    <Popover
      className="relative"
      id="user-menu-popover"
      placement="bottom"
      isNonModal={false}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="bordered"
          className="flex items-center gap-x-2 text-sm text-gray-900 border p-2 rounded-md bg-white"
        >
          <span className="truncate text-left ml-1 hidden lg:block">
            99770146
          </span>
          <IconChevronDown
            aria-hidden="true"
            className="size-5 flex-none text-gray-400"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        id="user-menu-popover-content"
        className="p-2 max-w-80 min-w-72"
      >
        <div className="w-full flex flex-col gap-y-2">
          {userMenuData.map((item, index) => (
            <div key={index}>
              {item.children.map((child, idx) => (
                <Link
                  key={idx}
                  href={child.key === "listings-create" ? `${lang}/listings/create` : child.href}
                  className="group relative flex items-center gap-x-6 rounded-lg p-3 text-sm/6 hover:bg-gray-50"
                >
                  <div className="flex-auto flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {child.icon && (
                        <child.icon aria-hidden="true" size={20} stroke={1.5} />
                      )}
                      <span className="text-sm">{child.name}</span>
                    </div>
                    <IconChevronRight size={20} stroke={1} />
                  </div>
                </Link>
              ))}

            </div>
          ))}
          <div className="w-full">
            <button
              onClick={onLogout}
              className="group relative flex items-center gap-x-6 rounded-lg p-3 text-sm/6 hover:bg-gray-50 w-full"
            >
              <div className="flex-auto flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <IconLogout aria-hidden="true" size={20} stroke={1.5} color="red" />
                  <span className="text-sm text-red-500">
                    Гарах
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

UserMenu.displayName = "UserMenu";

export default UserMenu;
