import { IAddressLvl } from "@/interfaces/address-lvl";

export class AddressLvl implements IAddressLvl {
  _id: string;
  parents: string[];
  parent: string | null;
  children: string[];
  name: string;
  nameEng: string;
  fieldLabel: string;
  level: number;
  sort: number;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: number[];
  };
  zipCode: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    parents,
    parent,
    children,
    name,
    nameEng,
    fieldLabel,
    level,
    sort,
    latitude,
    longitude,
    location,
    zipCode,
    createdAt,
    updatedAt,
  }: IAddressLvl) {
    this._id = _id;
    this.parents = parents;
    this.parent = parent;
    this.children = children;
    this.name = name;
    this.nameEng = nameEng;
    this.fieldLabel = fieldLabel;
    this.level = level;
    this.sort = sort;
    this.latitude = latitude;
    this.longitude = longitude;
    this.location = location;
    this.zipCode = zipCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new AddressLvl(json);
  }
}
