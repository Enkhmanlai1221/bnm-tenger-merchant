import { Booking } from "@/models/booking";
import { IBooking } from "@/interfaces/booking";
import { Result } from "@/models/result";
import { HttpRequest } from "@/utils/request";

const httpRequest = new HttpRequest(null, "/appaa");

export const list = async (data: any) => {
  const { rows, count } = await httpRequest.get("/bookings", data);
  return new Result<IBooking>({
    rows: rows.map((row: IBooking) => Booking.fromJson(row)),
    count,
  });
};

export const bookOrder = async (data: any) => {
  const booking = await httpRequest.post(`/bookings`, data);
  return new Booking(booking);
};

export const getOrder = async (id: string) => {
  const booking = await httpRequest.get(`/bookings/${id}`);
  return new Booking(booking);
};

export const priceDetail = async (data: any) => {
  return httpRequest.get(`/bookings/price`, data);
};

export const payOrder = async (id: string, data: any) => {
  return httpRequest.post(`/bookings/${id}/pay`, data);
};

export const cancelOrder = async (id: string, data: any) => {
  return httpRequest.post(`/bookings/${id}/cancel`, data);
};

export const payWithApplePay = async (id: string, data: any) => {
  return httpRequest.post(`/bookings/${id}/pay/apple`, data);
};
