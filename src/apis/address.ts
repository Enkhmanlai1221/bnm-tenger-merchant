import { IAddress } from "@/interfaces/address";
import { Address } from "@/models/address";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

// export const list = async (data?: any) => {
//   const response = await httpRequest.get("/addresses", {
//     ...(data || {}),
//     // limit: 50000,
//     page: 1,
//     levels: [0, 1, 2, 3],
//   });
//   return response.map((row: IAddress) => Address.fromJson(row));
// };

export const list = async (data?: any) => {
  // const res = await httpRequest.get("/addresses", data);
  // return res;

  const response = await httpRequest.get("/addresses", {
    ...(data || {}),
    limit: 10,
    page: 1,
    // levels: [0, 1, 2, 3],
    // levels: [0],
  });
  return response.map((row: IAddress) => Address.fromJson(row));
};

export const listWithPage = async (data?: any) => {
  const response = await httpRequest.get("/addresses", {
    ...(data || {}),
  });
  return {
    count: response.length,
    rows: response.map((row: IAddress) => Address.fromJson(row)),
  };
};
