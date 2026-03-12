import { IGerCluster } from "@/interfaces/ger-cluster";
import { IProperty } from "@/interfaces/property";
import { IShowPlace } from "@/interfaces/show-place";

export class GerCluster implements IGerCluster {
  location: {
    type: string;
    coordinates: [number, number];
  };
  _id: string;
  property: IProperty;
  showPlace: IShowPlace;
  isGerBook: boolean;
  isKhonog: boolean;
  search: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
  isAdminActive: boolean;

  constructor({
    location,
    _id,
    property,
    showPlace,
    isGerBook,
    isKhonog,
    search,
    longitude,
    latitude,
    createdAt,
    updatedAt,
    isAdminActive,
  }: IGerCluster) {
    this._id = _id;
    this.location = location;
    this.property = property;
    this.showPlace = showPlace;
    this.isGerBook = isGerBook;
    this.isKhonog = isKhonog;
    this.search = search;
    this.longitude = longitude;
    this.latitude = latitude;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isAdminActive = isAdminActive;
  }

  static fromJson(json: any) {
    return new GerCluster(json);
  }
}
