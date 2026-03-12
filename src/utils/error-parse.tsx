import { message } from "./message";

export function errorParse(error: any) {
  if (error?.statusCode < 400 || error?.statusCode > 499) {
    return message.error("Сервертэй холбогдох үед алдаа гарлаа.");
  }
  let errMessage = "Таны хүсэлт амжилтгүй.";
  if (typeof error.message === "string") {
    errMessage = error.message;
  }
  return message.error(errMessage);
}
