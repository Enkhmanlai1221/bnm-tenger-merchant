import { IReview } from "@/interfaces/review";
import { Result } from "@/models/result";
import { Review } from "@/models/review";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/reviews", data);
  return new Result<IReview>({
    rows: rows.map((row: IReview) => Review.fromJson(row)),
    count,
  });
};

export const get = async (id: string) => {
  const res = await httpRequest.get(`/reviews/${id}`);
  return Review.fromJson(res);
};

export const create = async (data: any) => {
  await httpRequest.post("/reviews", data);
};
