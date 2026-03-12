import { Booking } from "@/models/booking";
import { IProperty } from "./property";

export type IBooking = Booking;

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
  CONFIRMED = "CONFIRMED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export interface ICancelRequest {
  _id: string;
  user: string;
  booking: string;
  status: string;
  statusDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  adminNote: string;
  refundAmount: number;
}

export interface ICalendarCell {
  _id: string;
  totalBlocked: number;
  totalBookings: number;
  blocks: {
    property: IProperty;
    quantity: number;
  }[];
}
