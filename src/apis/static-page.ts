import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const get = async (key: string) => {
  const res = await httpRequest.get(`/${key}`);

  return res;
};
