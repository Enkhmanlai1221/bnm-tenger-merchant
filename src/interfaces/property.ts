import { Property } from "@/models/property";
import { IImage } from "./image";
import { IBooking } from "./booking";
export type IProperty = Property;

export enum PROPERTY_STATUS {
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  NEW = "NEW",
}

export interface IPropertyLocation {
  type: string;
  coordinates: [number, number];
}

export interface IPropertyCalendar {
  availableQuantity: number;
  bookings: {
    booking: IBooking;
    quantity: number;
    _id: string;
  }[];
  blockedQuantity: number;
  price: number;
  createdAt: string;
  date: string;
  hasPaid: boolean;
  property: string;
  type: string;
  updatedAt: string;
  _id: string;
}

export enum HIGHLIGHT {
  NEW = "NEW",
  SPONSORED = "SPONSORED",
  DISCOUNTED = "DISCOUNTED",
}

export interface IPropertySpecialDate {
  date: string;
  price: number;
  _id: string;
}

export enum PLACE_OFFERS_TYPES {
  FURNITURE = "FURNITURE",
  EQUIPMENT = "EQUIPMENT",
  OTHER = "OTHER",
}

export interface IPlaceOffer extends Document {
  _id: string;
  name: string;
  nameEng: string;
  type: PLACE_OFFERS_TYPES;
  image: IImage;
  sort: number;
  deletedAt: Date;
}

export interface IBlockedDate {
  date: string;
  quantity: number;
  _id: string;
}
