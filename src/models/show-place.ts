import { ICategory } from "@/interfaces/category";
import { IImage } from "@/interfaces/image";
import { IProperty } from "@/interfaces/property";
import { IShowPlace } from "@/interfaces/show-place";

export class ShowPlace implements IShowPlace {
  _id: string;
  isGerBook: boolean;
  isKhonog: boolean;
  name: string;
  description: string;
  images: IImage[];
  mainImage: IImage;
  category: ICategory;
  longitude: number;
  latitude: number;
  location: {
    type: string;
    coordinates: number[];
  };
  level1: string;
  level2: string;
  level3: string;
  additionalInformation: string;
  addressString: string;
  addressStringEng: string;
  sort: number;
  deletedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  properties: IProperty[];

  constructor({
    _id,
    isGerBook,
    isKhonog,
    name,
    description,
    images,
    mainImage,
    category,
    longitude,
    latitude,
    location,
    level1,
    level2,
    level3,
    additionalInformation,
    addressString,
    addressStringEng,
    sort,
    deletedAt,
    isActive,
    createdAt,
    updatedAt,
    isSaved,
    properties,
  }: IShowPlace) {
    this._id = _id;
    this.isGerBook = isGerBook;
    this.isKhonog = isKhonog;
    this.name = name;
    this.description = description;
    this.images = images;
    this.mainImage = mainImage;
    this.category = category;
    this.longitude = longitude;
    this.latitude = latitude;
    this.location = location;
    this.level1 = level1;
    this.level2 = level2;
    this.level3 = level3;
    this.additionalInformation = additionalInformation;
    this.addressString = addressString;
    this.addressStringEng = addressStringEng;
    this.sort = sort;
    this.deletedAt = deletedAt;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isSaved = isSaved;
    this.properties = properties;
  }

  static fromJson(json: any) {
    return new ShowPlace(json);
  }
}
