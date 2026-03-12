import { IVideo } from "@/interfaces/video";

export class Video implements IVideo {
  _id: string;
  type: "VIDEO";
  createdAt: string;
  user: string;
  url: string;
  duration: number;
  blurhash: string;
  thumbnail: string;
  thumbnail64: string;
  height: number;
  width: number;

  constructor({
    _id,
    createdAt,
    user,
    url,
    duration,
    blurhash,
    thumbnail,
    thumbnail64,
    height,
    width,
  }: IVideo) {
    this._id = _id;
    this.type = "VIDEO";
    this.createdAt = createdAt;
    this.user = user;
    this.url = url;
    this.duration = duration;
    this.blurhash = blurhash;
    this.thumbnail = thumbnail;
    this.thumbnail64 = thumbnail64;
    this.height = height;
    this.width = width;
  }

  static fromJson(json: any) {
    return new Video(json);
  }
}
