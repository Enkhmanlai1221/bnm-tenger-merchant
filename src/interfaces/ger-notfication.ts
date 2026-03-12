import { GerNotification } from "@/models/ger-notfication";

export type IGerNotification = GerNotification;

export enum GerNotificationType {
  BOOKING = "BOOKING",
  PROPERTY = "PROPERTY",
  REVIEW = "REVIEW",
  SYSTEM = "SYSTEM",
}
