import { IShowPlace } from "@/interfaces/show-place";
import { Result } from "@/models/result";
import { ShowPlace } from "@/models/show-place";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/show-places", data);
  return new Result<IShowPlace>({
    rows: rows.map((row: IShowPlace) => ShowPlace.fromJson(row)),
    count,
  });
};

export const get = async (id: string, data: any = {}) => {
  const res = await httpRequest.get(`/show-places/${id}`, data);
  return ShowPlace.fromJson(res);
};

export const placeCategories = async () => {
  const res = await httpRequest.get("/place-categories", {
    limit: 100,
    page: 1,
  });
  return res?.rows || [];
};
