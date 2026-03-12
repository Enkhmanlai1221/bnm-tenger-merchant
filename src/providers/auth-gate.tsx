"use client";

import { authApi, stayApi } from "@/apis";
import { useSocket } from "@/lib/socket/client";
import { RootState } from "@/store";
import { logout } from "@/store/auth-slice";
import { setAvailableTags, setNotificationCount } from "@/store/general-slice";
import { usePathname, useRouter } from "next/navigation";
import qs from "qs";
import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";

export const AuthGateContext = createContext({});

export default function AuthGateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const socket = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, sessionScope } = useSelector(
    (state: RootState) => state.auth,
  );


  // useEffect(() => {
  //   if (!data) return;

  //   if (data.userStatus === "NEW" && pathname !== "/otp-verify") {
  //     const query = qs.stringify({
  //       otpMethod: "REGISTER",
  //       type: data.type,
  //     });
  //     router.replace(`/otp-verify?${query}`);
  //     return;
  //   }

  //   const needsMerchantRegistration =
  //     data.type === "MERCHANT" &&
  //     (data.userStatus === "OTP_VERIFIED" || data.userStatus === "VERIFIED") &&
  //     (!data.firstName || !data.contract || !data.bankAccount) &&
  //     pathname.indexOf("/registration") === -1;

  //   const needsAppUserRegistration =
  //     data.type === "APP_USER" &&
  //     data.userStatus === "OTP_VERIFIED" &&
  //     pathname.indexOf("/registration") === -1;

  //   if (needsMerchantRegistration || needsAppUserRegistration) {
  //     router.replace("/registration");
  //   }
  // }, [data, pathname, router, sessionScope]);

  // if (!isClient || (!data && isAuthorized)) {
  //   return (
  //     <div className="absolute inset-0 flex items-center justify-center bg-white">
  //       <div className="flex flex-col items-center justify-center gap-4">
  //         <Spinner />
  //         <div className="text-sm text-gray-500">Loading A...</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <AuthGateContext.Provider value={{}}>{children}</AuthGateContext.Provider>
  );
}
