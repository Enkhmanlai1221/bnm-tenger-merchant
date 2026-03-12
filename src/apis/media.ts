import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const upload = async (data: FormData | any) => {
  return httpRequest.upload(`/media/image/upload`, data);
};
