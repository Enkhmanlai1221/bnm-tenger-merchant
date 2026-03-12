import { IBanner } from "@/interfaces/banner";
import { Banner } from "@/models/banner";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

// export const list = async () => {
//   const response = await httpRequest.get("/banners");
//   return {
//     rows: response.map((row: IBanner) => Banner.fromJson(row)),
//     count: response.length,
//   };
// };

export const list = async (data: any) => {
  const response = await httpRequest.get("/banners", data);
  return {
    rows: response.map((row: IBanner) => Banner.fromJson(row)),
    count: response.length,
  };
};

// export const list = async (data: any) => {
//   const res = await httpRequest.get("/banners", data);
//   const { rows, count } = await httpRequest.get("/banners", data);
//   return new Result<IBanner>({
//     rows: rows.map((row: IBanner) => Banner.fromJson(row)),
//     count,
//   });
//   return res;
// };
