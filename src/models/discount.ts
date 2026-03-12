import { IDiscount, IDiscountType } from "@/interfaces/discount";

export class Discount implements IDiscount {
  discountType: IDiscountType;
  rate: number;
  _id: string;

  constructor({ _id, discountType, rate }: IDiscount) {
    this._id = _id;
    this.discountType = discountType;
    this.rate = rate;
  }

  static fromJson(json: any) {
    return new Discount(json);
  }
}
