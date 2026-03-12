import { BOOKING_STATUS, IBooking, ICancelRequest } from "@/interfaces/booking";
import { IUser } from "@/interfaces/user";
import { IProperty } from "@/interfaces/property";
import { IReview } from "@/interfaces/review";
import { IPayment } from "@/interfaces/payment";
import { IMerchant } from "@/interfaces/merchant";
import { IDiscount, IDiscountType } from "@/interfaces/discount";
import { ICancelPolicy } from "@/interfaces/cancel-policy";

export class Booking implements IBooking {
  _id: string;
  property: IProperty;
  user: IUser;
  code: string;
  days: number;
  amount: number;
  totalAmount: number;
  discount: number;
  discountObj: IDiscount;
  status: BOOKING_STATUS;
  statusDate: string;
  startDate: string;
  endDate: string;
  merchant: IMerchant;
  deadline: string;
  propertyQuantity: number;
  search: string;
  createdAt: string;
  updatedAt: string;
  payment: IPayment;
  review: IReview | null;
  cancelRequest: ICancelRequest | null;
  personCount: number;
  refundFee: number;
  refundAmount: number;
  cancelPolicy: ICancelPolicy;

  constructor({
    _id,
    user,
    property,
    code,
    days,
    amount,
    totalAmount,
    discount,
    discountObj,
    status,
    statusDate,
    startDate,
    endDate,
    merchant,
    deadline,
    propertyQuantity,
    search,
    createdAt,
    updatedAt,
    payment,
    review,
    cancelRequest,
    personCount,
    refundFee,
    refundAmount,
    cancelPolicy,
  }: IBooking) {
    this._id = _id;
    this.user = user;
    this.property = property;
    this.code = code;
    this.days = days;
    this.amount = amount;
    this.totalAmount = totalAmount;
    this.discount = discount;
    this.discountObj = discountObj;
    this.status = status;
    this.statusDate = statusDate;
    this.startDate = startDate;
    this.endDate = endDate;
    this.merchant = merchant;
    this.deadline = deadline;
    this.propertyQuantity = propertyQuantity;
    this.search = search;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.payment = payment;
    this.review = review;
    this.cancelRequest = cancelRequest;
    this.personCount = personCount;
    this.refundFee = refundFee;
    this.refundAmount = refundAmount;
    this.cancelPolicy = cancelPolicy;
  }

  static fromJson(json: any) {
    return new Booking(json);
  }
}
