import { GerNotification } from "@/models/ger-notfication";
import { IGerNotification } from "@/interfaces/ger-notfication";
import { Result } from "@/models/result";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/notifications", data);
  return new Result<IGerNotification>({
    rows: rows.map((row: IGerNotification) => GerNotification.fromJson(row)),
    count,
  });
};

export const get = async (id: string) => {
  return httpRequest.get(`/notifications/${id}`);
};
