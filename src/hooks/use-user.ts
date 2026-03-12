import { useSelector } from "react-redux";
import { IAuth } from "@/interfaces/auth";
import useSWR from "swr";
import { authApi } from "@/apis";

export const useUser = () => {
  const { accessToken } = useSelector((state: { auth: IAuth }) => state.auth);
  const { data, isValidating } = useSWR(`swr.user.${accessToken}`, () => authApi.me());

  return { user: data, isFetching: isValidating }
};
