import { User } from "@/models/user";

export type IUser = User;

export enum UserType {
  APP_USER = "APP_USER",
  MERCHANT = "MERCHANT",
}

export enum MERCHANT_TYPE {
  ORGANIZATION = "ORGANIZATION",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum VerifiedMethodType {
  DAN = "DAN",
  KYC = "KYC",
}
