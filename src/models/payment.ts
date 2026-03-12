import { IPayment, PAYMENT_STATUS } from "@/interfaces/payment";

export class Payment implements IPayment {
  _id: string;
  user: string;
  invoice: string;
  method: string;
  amount: number;
  currency: string;
  description: string;
  status: PAYMENT_STATUS;
  statusDate: string;
  booking: string;
  createdAt: string;
  updatedAt: string;
  qpayInvoiceId: string;
  qpay: {
    invoice_id: string;
    qr_text: string;
    qPay_shortUrl: string;
    urls: {
      name: string;
      description: string;
      logo: string;
      link: string;
    }[];
    qr_image: string;
  };
  golomt: {
    checksum: string;
    invoice: string;
    redirectUri: string;
    socialDeeplink: string;
    transactionId: string;
  };
  pocket: {
    deeplink: string;
    id: number;
    orderNumber: string;
    qr: string;
  }

  constructor({
    _id,
    user,
    invoice,
    method,
    amount,
    currency,
    description,
    status,
    statusDate,
    booking,
    createdAt,
    updatedAt,
    qpayInvoiceId,
    qpay,
    golomt,
    pocket,
  }: IPayment) {
    this._id = _id;
    this.user = user;
    this.invoice = invoice;
    this.method = method;
    this.amount = amount;
    this.currency = currency;
    this.description = description;
    this.status = status;
    this.statusDate = statusDate;
    this.booking = booking;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.qpayInvoiceId = qpayInvoiceId;
    this.qpay = qpay;
    this.golomt = golomt;
    this.pocket = pocket;
  }

  static fromJson(json: any) {
    return new Payment(json);
  }
}
