import { IFaq } from "@/interfaces/faq";
import { Faq } from "@/models/faq";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const all = async (data: { page: number; limit: number }) => {
  const { rows, count } = await httpRequest.get("/faqs", data);
  return {
    rows: rows.map((row: IFaq) => Faq.fromJson(row)),
    count,
  };
};
