"use client";

import { authApi } from "@/apis";
import { setToken } from "@/store/auth-slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function AuthToken() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  // useEffect(() => {
  //   if (searchParamsObj.token) {
  //     (async () => {
  //       try {
  //         dispatch(
  //           setToken({
  //             accessToken: searchParamsObj.token,
  //             sessionScope: "AUTHORIZED",
  //           }),
  //         );
  //         await authApi.me();
  //         router.replace("/");
  //       } catch (error) {
  //         // router.replace("/login");
  //       }
  //     })();
  //   }
  // }, [searchParamsObj.token, router, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      Processing authentication...
    </div>
  );
}
