import { IWishlist } from "@/interfaces/wishlist";
import { Result } from "@/models/result";
import { Wishlist } from "@/models/wishlist";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/wishlists", data);
  return new Result<IWishlist>({
    rows: rows.map((row: IWishlist) => Wishlist.fromJson(row)),
    count,
  });
};

export const addToWishlist = async (
  id: string,
  type?: "place" | "property",
) => {
  let bodyData = {};
  if (type === "place") {
    bodyData = {
      showPlace: id,
    };
  } else {
    bodyData = {
      property: id,
    };
  }
  return await httpRequest.post(`/wishlists`, bodyData);
};

export const addToWishPlacelist = async (
  id: string,
) => {
  let bodyData = {};
    bodyData = {
      showPlace: id,
    };
  return await httpRequest.post(`/wishlists`, bodyData);
};