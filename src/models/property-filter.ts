import { IImage } from "@/interfaces/image";
import { IPropertyFilter } from "@/interfaces/property-filter";

export class PropertyFilter implements IPropertyFilter {
  count: number;
  priceMin: number;
  priceMax: number;
  placeOffers: {
    _id: string;
    name: string;
    image: IImage;
    count: number;
  }[];
  tags: {
    _id: string;
    name: string;
    icon: string;
    count: number;
  }[];

  constructor({
    count,
    priceMin,
    priceMax,
    placeOffers,
    tags,
  }: IPropertyFilter) {
    this.count = count;
    this.priceMin = priceMin;
    this.priceMax = priceMax;
    this.placeOffers = placeOffers;
    this.tags = tags;
  }

  static fromJson(json: any) {
    return new PropertyFilter(json);
  }
}
