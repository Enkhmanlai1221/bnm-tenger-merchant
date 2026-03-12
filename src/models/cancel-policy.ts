import { ICancelPolicy, ICancelPolicyType } from "@/interfaces/cancel-policy";

export class CancelPolicy implements ICancelPolicy {
  cancelPolicy: ICancelPolicyType;
  rate: number;
  _id: string;

  constructor({ _id, cancelPolicy, rate }: ICancelPolicy) {
    this._id = _id;
    this.cancelPolicy = cancelPolicy;
    this.rate = rate;
  }

  static fromJson(json: any) {
    return new CancelPolicy(json);
  }
}
