import { IAddress } from "@/interfaces/address";

export class Address implements IAddress {
  _id: string;
  parent: any;
  name: string;
  nameEng: string;

  constructor({ _id, parent, name, nameEng }: IAddress) {
    this._id = _id;
    this.parent = parent;
    this.name = name;
    this.nameEng = nameEng;
  }

  static fromJson(json: any) {
    return new Address(json);
  }
}
