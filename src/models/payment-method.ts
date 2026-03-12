import { IPaymentMethod } from "@/interfaces/payment-method";

export class PaymentMethod implements IPaymentMethod {
  _id: string;
  code: string;
  createdAt: string;
  PaymentMethod: string;
  image: string;
  isActive: boolean;
  name: string;
  updatedAt: string;

  constructor({
    _id,
    code,
    createdAt,
    PaymentMethod,
    isActive,
    name,
    updatedAt,
    image,
  }: IPaymentMethod) {
    this._id = _id;
    this.code = code;
    this.image = image;
    this.PaymentMethod = PaymentMethod;
    this.isActive = isActive;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new PaymentMethod(json);
  }
}
