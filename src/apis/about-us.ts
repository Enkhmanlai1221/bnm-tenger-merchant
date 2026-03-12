import { PrivacyPolicy } from "@/models/privacy-policy";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const get = async () => {
  const res = await httpRequest.get("/about-us");

  return PrivacyPolicy.fromJson(res);
};
