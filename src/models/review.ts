import { IReview } from "@/interfaces/review";
import { IUser } from "@/interfaces/user";

export class Review implements IReview {
  _id: string;
  user: IUser;
  property: string;
  booking: string;
  rate: number;
  text: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    user,
    property,
    booking,
    rate,
    text,
    createdAt,
    updatedAt,
  }: IReview) {
    this._id = _id;
    this.user = user;
    this.property = property;
    this.booking = booking;
    this.rate = rate;
    this.text = text;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new Review(json);
  }
}
