import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data?: any) => {
  const res = await httpRequest.get("/zones", data);
  return res;
};
