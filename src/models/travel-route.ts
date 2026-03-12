import { IImage } from "@/interfaces/image";
import { IShowPlace } from "@/interfaces/show-place";
import { ITag } from "@/interfaces/tag";
import { ITravelRoute } from "@/interfaces/travel-route";

export class TravelRoute implements ITravelRoute {
  _id: string;
  isGerBook: boolean;
  isKhonog: boolean;
  name: string;
  description: string;
  tags: ITag[];
  images: IImage[];
  mainImage: IImage;
  days: number;
  sort: number;
  level1s: string[];
  isActive: boolean;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  places: {
    createdAt: string;
    place: IShowPlace;
    route: string;
    sort: number;
    updatedAt: string;
    _id: string;
  }[];
  isSaved: boolean;

  constructor({
    _id,
    isGerBook,
    isKhonog,
    name,
    description,
    tags,
    images,
    mainImage,
    days,
    sort,
    level1s,
    isActive,
    deletedAt,
    createdAt,
    updatedAt,
    places,
    isSaved,
  }: ITravelRoute) {
    this._id = _id;
    this.isGerBook = isGerBook;
    this.isKhonog = isKhonog;
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.images = images;
    this.mainImage = mainImage;
    this.days = days;
    this.sort = sort;
    this.level1s = level1s;
    this.isActive = isActive;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.places = places;
    this.isSaved = isSaved;
  }

  static fromJson(json: any) {
    return new TravelRoute(json);
  }
}
