import { IBooking } from "@/interfaces/booking";
import { IProperty } from "@/interfaces/property";
import { ITransaction } from "@/interfaces/transaction";
import { Booking } from "@/models/booking";
import { Property } from "@/models/property";
import { Result } from "@/models/result";
import { Transaction } from "@/models/transaction";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa"); // user

export const bookinglistings = async (data: any) => {
  const { rows, count } = await httpRequest.get("/merchants/bookings", data);
  return new Result<IBooking>({
    rows: rows.map((row: IBooking) => Booking.fromJson(row)),
    count,
  });
};

export const getBooking = async (id: string): Promise<IBooking> => {
  const res = await httpRequest.get(`/merchants/bookings/${id}`);
  return Booking.fromJson(res);
};

export const danVerify = async (): Promise<any> => {
  const res = await httpRequest.get(`/merchants/dan/verify`);
  return res;
};

export const properylistings = async (data: any) => {
  const { rows, count } = await httpRequest.get("/merchants/properties", data);
  return new Result<IProperty>({
    rows: rows.map((row: IProperty) => Property.fromJson(row)),
    count,
  });
};

export const getProperty = async (id: string): Promise<IProperty> => {
  const res = await httpRequest.get(`/merchants/properties/${id}`);
  return Property.fromJson(res);
};

export const createProperty = async (data: any) => {
  const res = await httpRequest.post("/properties", data);
  return res;
};

export const updateProperty = async (id: string, data: any) => {
  const res = await httpRequest.put(`/properties/${id}`, data);
  return res;
};

export const publishProperty = async (id: string, data: any) => {
  const res = await httpRequest.put(`/properties/${id}/active`, data);
  return res;
};

export const cancelBooking = async (id: string, data: any = {}) => {
  const res = await httpRequest.put(`/merchants/bookings/${id}/cancel`, data);
  return res;
};

export const propertyCalendar = async (id: string, data: any) => {
  const res = await httpRequest.put(`/properties/${id}/calendar`, data);
  return res;
};

export const bankAccountUpdate = async (data: any) => {
  const res = await httpRequest.put(`/merchants/bank-account`, data);
  return res;
};

export const getCalendar = async (
  data: any,
): Promise<{
  calendars: {
    _id: string;
    totalBlocked: number;
    totalBookings: number;
    blocks: {
      property: string;
      quantity: number;
    }[];
  }[];
  totalQuantity: number;
}> => {
  const res = await httpRequest.get(`/merchants/calendars`, data);
  return res;
};

export const propertyDates = async (id: string, data: any) => {
  const res = await httpRequest.put(`/properties/${id}/calendars`, data);
  return res;
};

export const getDashboard = async () => {
  const res = await httpRequest.get(`/merchants/dashboard`);
  return res;
};

export const getOrderChart = async (data: any) => {
  const res = await httpRequest.get(`/merchants/orders/chart`, data);
  return res;
};

export const getProfitChart = async (data: any) => {
  const res = await httpRequest.get(`/merchants/profits/chart`, data);
  return res;
};

export const transactions = async (
  data: any,
): Promise<Result<ITransaction>> => {
  const { rows, count, ...rest } = await httpRequest.get(
    "/merchants/transactions",
    data,
  );
  return {
    rows: rows.map((row: ITransaction) => Transaction.fromJson(row)),
    count,
    ...rest,
  };
};

export const contract = async (data: any) => {
  const res = await httpRequest.get(`/merchant-contract`, data);
  return res;
};

export const sign = async (data: any) => {
  const res = await httpRequest.post("/merchant-contract/sign", data);
  return res;
};
