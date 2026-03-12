import { IBanner } from "@/interfaces/banner";
import { IImage } from "@/interfaces/image";

export class Banner implements IBanner {
  _id: string;
  title: string;
  image: IImage | null;
  video: IImage | null;
  link: string | null;
  object: string;
  objectType: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
  property: string;
  route: string | null;
  showPlace: string | null;
  isApp: boolean;
  isWeb: boolean;

  constructor({
    _id,
    title,
    image,
    video,
    link,
    object,
    objectType,
    sort,
    createdAt,
    updatedAt,
    property,
    route,
    showPlace,
    isApp,
    isWeb,
  }: IBanner) {
    this._id = _id;
    this.title = title;
    this.image = image;
    this.video = video;
    this.link = link;
    this.object = object;
    this.objectType = objectType;
    this.sort = sort;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.property = property;
    this.route = route;
    this.showPlace = showPlace;
    this.isApp = isApp;
    this.isWeb = isWeb;
  }

  static fromJson(json: any) {
    return new Banner(json);
  }
}
