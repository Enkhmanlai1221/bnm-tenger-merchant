import { CancelPolicy } from "@/models/cancel-policy";

export type ICancelPolicy = CancelPolicy;

export enum CANCEL_POLICY_TYPES {
  ORDER = "ORDER",
  DAY = "DAY",
}

export interface ICancelPolicyType {
  createdAt: string;
  defaultVariant: number;
  end: number;
  name: string;
  nameEng: string;
  start: number;
  updatedAt: string;
  updatedBy: string;
  variants: number[];
  _id: string;
}
