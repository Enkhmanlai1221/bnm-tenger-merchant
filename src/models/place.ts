import { IPlace } from "@/interfaces/place";

export class Place implements IPlace {
  _id: string;
  name: string;
  type: string;
  appType: string;
  image: string;
  sort: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    name,
    type,
    appType,
    image,
    sort,
    deletedAt,
    createdAt,
    updatedAt,
  }: IPlace) {
    this._id = _id;
    this.name = name;
    this.type = type;
    this.appType = appType;
    this.image = image;
    this.sort = sort;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new Place(json);
  }
}
