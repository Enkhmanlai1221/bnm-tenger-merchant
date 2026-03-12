import { INotification } from "@/interfaces/notification";

export class Notification implements INotification {
  _id: string;
  user: string;
  createdAt: string;
  title: string;
  description: string;
  type: "INFO" | "LINK";
  action: string;
  seenAt: string;

  constructor({
    _id,
    user,
    createdAt,
    title,
    description,
    type,
    action,
    seenAt,
  }: INotification) {
    this._id = _id;
    this.user = user;
    this.createdAt = createdAt;
    this.title = title;
    this.description = description;
    this.type = type;
    this.action = action;
    this.seenAt = seenAt;
  }

  static fromJson(json: any) {
    return new Notification(json);
  }
}
