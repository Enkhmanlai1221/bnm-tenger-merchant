"use client";

import React, { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/auth-slice";
import { authApi } from "@/apis";
import { RootState } from "@/store";
import { message } from "../utils/message";
import useSWR from "swr";
import { Spinner } from "@heroui/react";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext({});

const PriviteProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // const { data, error } = useSWR(
  //   accessToken ? `swr.user.${JSON.stringify(accessToken)}` : null,
  //   async () => authApi.me(),
  //   {
  //     revalidateOnFocus: false,
  //     onError: (err) => {
  //       if (err.statusCode === 401) {
  //         message.error("Та хандах эрхгүй байна!");
  //         dispatch(logout());
  //         replace("/login");
  //       }
  //       return err;
  //     },
  //   },
  // );

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // useEffect(() => {
  //   if (!accessToken && !isClient) {
  //     if (pathname !== "/login") {
  //       replace("/login");
  //     }
  //   }
  // }, [accessToken, replace, isClient, pathname]);

  // if (error) {
  //   replace("/login");
  // }

  // if (!isClient || !data) {
  //   return (
  //     <div className="absolute inset-0 flex items-center justify-center bg-white">
  //       <div className="flex flex-col items-center justify-center gap-4">
  //         <Spinner />
  //         <div className="text-sm text-gray-500">Loading ...</div>
  //       </div>
  //     </div>
  //   );
  // }
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

PriviteProvider.displayName = "PriviteProvider";

export default PriviteProvider;
