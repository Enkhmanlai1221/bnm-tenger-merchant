import { IPrivacyPolicy } from "@/interfaces/privacy-policy";

export class PrivacyPolicy implements IPrivacyPolicy {
  _id: string;
  text: string;
  appType: string;
  createdAt: string;
  updatedAt: string;

  constructor({ _id, text, appType, createdAt, updatedAt }: IPrivacyPolicy) {
    this._id = _id;
    this.text = text;
    this.appType = appType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new PrivacyPolicy(json);
  }
}
