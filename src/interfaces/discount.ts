import { Discount } from "@/models/discount";

export type IDiscount = Discount;

export enum DISCOUNT_TYPES {
  ORDER = "ORDER",
  DAY = "DAY",
}

export interface IDiscountType {
  _id: string;
  type: DISCOUNT_TYPES;
  deletedAt: string | null;
  value: number;
  createdAt: string;
  updatedAt: string;
}
