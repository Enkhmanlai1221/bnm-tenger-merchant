import { IContactInfo } from "@/interfaces/contact-info";

export class ContactInfo implements IContactInfo {
  _id: string;
  phone: string;
  email: string;
  socials: {
    name: string;
    logo: string;
    link: string;
    _id: string;
  }[];
  address: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    phone,
    email,
    socials,
    address,
    updatedBy,
    createdAt,
    updatedAt,
  }: IContactInfo) {
    this._id = _id;
    this.phone = phone;
    this.email = email;
    this.socials = socials;
    this.address = address;
    this.updatedBy = updatedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new ContactInfo(json);
  }
}
