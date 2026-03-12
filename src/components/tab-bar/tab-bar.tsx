"use client";

import { useLanguage } from "@/providers/language";
import { IconHome, IconUserCircle, IconWorld } from "@tabler/icons-react";
import { NavLink } from "../NavLink";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

export function TabBar() {
  const { translate } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);

  const menu = [
    {
      href: "/",
      label: translate("home", "Home"),
      icon: <IconHome size={26} strokeWidth={1.6} />,
    },
    {
      href: "/places",
      label: translate("beautiful_places", "Beautiful places"),
      icon: <IconWorld size={26} strokeWidth={1.6} />,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur bg-white/90 border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center py-3">
        {menu.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-1 text-gray-500 data-[active=true]:text-primary-600 transition-all duration-200"
          >
            <div className="flex flex-col items-center">
              {item.icon}
              <span className="text-[11px] font-medium">{item.label}</span>
            </div>
            <span className="absolute bottom-0 w-5 h-[2px] rounded-full bg-primary-600 opacity-0 data-[active=true]:opacity-100 transition-opacity duration-200" />
          </NavLink>
        ))}

        <NavLink
          href="/settings"
          className="relative flex flex-col items-center gap-1 text-gray-500 data-[active=true]:text-primary-600 transition-all duration-200"
        >
          {user ? (
            <>
              {user.avatar ? (
                <div className="h-7 w-7 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <Image
                    src={user.avatar.url}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : (
                <IconUserCircle size={26} strokeWidth={1.6} />
              )}
              <span className="text-[11px] font-medium">
                {translate("profile_nav", "Profile")}
              </span>
            </>
          ) : (
            <>
              <IconUserCircle size={26} strokeWidth={1.6} />
              <span className="text-[11px] font-medium">
                {translate("login", "Login")}
              </span>
            </>
          )}
          <span className="absolute bottom-0 w-5 h-[2px] rounded-full bg-primary-600 opacity-0 data-[active=true]:opacity-100 transition-opacity duration-200" />
        </NavLink>
      </div>
    </div>
  );
}