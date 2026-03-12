import { HttpRequest } from "@/utils/request";
import { store } from "@/store";
import { authMe } from "@/store/auth-slice";
import dayjs from "dayjs";

const httpRequest = new HttpRequest(null, "/appaa"); // user

export const me = async () => {
  const res = await httpRequest.get("/auth/me");
  store.dispatch(authMe(res));
  return res;
};

export const logout = async () => {
  const res = await httpRequest.post("/auth/logout");
  return res;
};

export const login = async (data: any) => {
  const res = await httpRequest.post("/auth/login", data);
  return res;
};

export const register = async (data: any) => {
  const res = await httpRequest.post(`/auth/register`, data); // INDIVIDUAL
  return res;
};

export const forgotPassword = async (data: any) => {
  const res = await httpRequest.post(`/auth/forgot`, data);
  return res;
};

export const otp = async (data: any) => {
  const res = await httpRequest.get(`/otp`, data);
  return {
    message: res.message,
    expiryIn: res.expiryIn,
    resendIn: dayjs().add(30, "seconds"),
  };
};

export const verify = async (data: any) => {
  const res = await httpRequest.post(`/otp/verify`, data);
  return res;
};

export const changePassword = async (data: any) => {
  const res = await httpRequest.post(`/auth/change-password`, data);
  return res;
};

export const updateProfile = async (data: any) => {
  return httpRequest.put(`/user/profile`, data);
};

export const deactivateAccount = async () => {
  return httpRequest.post(`/user/account/deactive`);
};

export const deactivateAccountVerify = async (data: any) => {
  return httpRequest.post(`/user/account/deactive/verify`, data);
};

export const phoneChange = async (data: any) => {
  return httpRequest.put(`/merchants/phone`, data);
};

export const phoneVerify = async (data: any) => {
  return httpRequest.post(`/merchants/phone/verify`, data);
};

export const emailChange = async (data: any) => {
  return httpRequest.put(`/merchants/email`, data);
};

export const emailVerify = async (data: any) => {
  return httpRequest.post(`/merchants/email/verify`, data);
};
