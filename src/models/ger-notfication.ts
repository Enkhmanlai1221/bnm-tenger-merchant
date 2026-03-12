import { IGerNotification } from "@/interfaces/ger-notfication";

export class GerNotification implements IGerNotification {
  _id: string;
  user: string;
  title: string;
  description: string;
  objectType: string;
  object: any;
  type: string;
  hasGetItem: boolean;
  hasSeenList: boolean;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    user,
    title,
    description,
    objectType,
    object,
    type,
    hasGetItem,
    hasSeenList,
    createdAt,
    updatedAt,
  }: IGerNotification) {
    this._id = _id;
    this.user = user;
    this.title = title;
    this.description = description;
    this.objectType = objectType;
    this.object = object;
    this.type = type;
    this.hasGetItem = hasGetItem;
    this.hasSeenList = hasSeenList;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new GerNotification(json);
  }
}
