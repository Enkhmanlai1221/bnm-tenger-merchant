import { Payment } from "@/models/payment";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const methodList = async (data?: any) => {
  return httpRequest.get(`/payment/methods`, data);
};

export const get = async (id: string) => {
  const res = await httpRequest.get(`/payments/${id}`);
  return Payment.fromJson(res);
};

export const paid = async (id: string) => {
  return httpRequest.post(`/payments/${id}/paid`);
};

export const checkPayment = async (id: string) => {
  return httpRequest.get(`/payments/${id}/check`);
};
