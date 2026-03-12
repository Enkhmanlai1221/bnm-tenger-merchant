import { Payment } from "@/models/payment";

export type IPayment = Payment;

export enum PAYMENT_STATUS {
  PAID = "PAID",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
}

export enum PAYMENT_METHOD {
  CARD = "CARD",
  WECHAT = "WECHAT",
  QPAY = "QPAY",
  POCKET = "POCKET",
  STOREPAY = "STOREPAY",
}
