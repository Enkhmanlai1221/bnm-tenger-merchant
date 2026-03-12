import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const update = async (data: any) => {
  return httpRequest.post(`/user/profile`, data);
};

export const getCountries = async () => {
  return httpRequest.get(`/user/countries`);
};
