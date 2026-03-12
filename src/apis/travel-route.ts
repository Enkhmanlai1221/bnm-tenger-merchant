import { ITravelRoute } from "@/interfaces/travel-route";
import { Result } from "@/models/result";
import { TravelRoute } from "@/models/travel-route";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/routes", data);
  return new Result<ITravelRoute>({
    rows: rows.map((row: ITravelRoute) => TravelRoute.fromJson(row)),
    count,
  });
};

export const get = async (id: string) => {
  const res = await httpRequest.get(`/routes/${id}`);
  return TravelRoute.fromJson(res);
};
