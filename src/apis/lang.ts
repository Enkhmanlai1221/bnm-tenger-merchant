import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const langDictionary = async (lang: string) => {
  return httpRequest.get(`/languages/${lang}`);
};
