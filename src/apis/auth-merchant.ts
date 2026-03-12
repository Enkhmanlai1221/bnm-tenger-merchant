import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa"); // user

export const reme = async () => {
  const res = await httpRequest.get("/merchants/me");
  return res;
};

export const login = async (data: any) => {
  const res = await httpRequest.post("/auth/login/merchant", data);
  return res;
};

export const register = async (data: any) => {
  const res = await httpRequest.post(`/auth/register/merchant`, data);
  return res;
};

export const forgotPassword = async (data: any) => {
  const res = await httpRequest.post(`/auth/forgot/merchant`, data);
  return res;
};

export const updateProfile = async (data: any) => {
  const res = await httpRequest.put(`/merchants/profile`, data);
  return res;
};

export const updateSocial = async (data: any) => {
  const res = await httpRequest.put(`/merchants/socials`, data);
  return res;
};

export const manualKyc = async (data: any) => {
  const res = await httpRequest.post(`/merchants/kyc/verify`, data);
  return res;
};

export const authWithDanCode = async (data: any) => {
  const res = await httpRequest.post(`/merchants/dan/info`, data);
  return res;
};
