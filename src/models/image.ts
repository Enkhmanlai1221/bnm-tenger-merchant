import { IImage } from "@/interfaces/image";

export class Image implements IImage {
  _id: string;
  user: string;
  url: string;
  thumbnail: string;
  originalUrl: string;
  blurhash: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    user,
    url,
    thumbnail,
    originalUrl,
    blurhash,
    createdAt,
    updatedAt,
  }: IImage) {
    this._id = _id;
    this.user = user;
    this.url = url;
    this.thumbnail = thumbnail;
    this.originalUrl = originalUrl;
    this.blurhash = blurhash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new Image(json);
  }
}
