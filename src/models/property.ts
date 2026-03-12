import { IAddressLvl } from "@/interfaces/address-lvl";
import { ICancelPolicy } from "@/interfaces/cancel-policy";
import { IDiscount } from "@/interfaces/discount";
import { IImage } from "@/interfaces/image";
import { IMerchant } from "@/interfaces/merchant";
import {
  HIGHLIGHT,
  IBlockedDate,
  IPlaceOffer,
  IProperty,
  IPropertyCalendar,
  IPropertyLocation,
  IPropertySpecialDate,
  PROPERTY_STATUS,
} from "@/interfaces/property";
import { IShowPlace } from "@/interfaces/show-place";
import { ITag } from "@/interfaces/tag";

export class Property implements IProperty {
  isSponsored: boolean;
  _id: string;
  merchant: IMerchant;
  isGerBook: boolean;
  isKhonog: boolean;
  name: string;
  nameEng: string;
  description: string;
  descriptionEng: string;
  images: IImage[];
  mainImage: IImage;
  level0: IAddressLvl;
  level1: IAddressLvl;
  level2: IAddressLvl;
  level3: IAddressLvl;
  additionalInformation: string;
  addressString: string;
  addressStringEng: string;
  longitude: number;
  latitude: number;
  location: IPropertyLocation;
  bedsCount: number;
  price: number;
  placeOffers: IPlaceOffer[];
  discounts: IDiscount[];
  cancelPolicies: ICancelPolicy[];
  maxPersonCount: number;
  checkInTime: string;
  checkOutTime: string;
  quiteStartTime: string;
  quiteTimeEnd: string;
  status: PROPERTY_STATUS;
  deletedAt: Date | null;
  specialDates: IPropertySpecialDate[];
  propertyVersion: string;
  createdAt: string;
  updatedAt: string;
  avgRate: number;
  maxDiscount: number;
  blockedDates: IBlockedDate[];
  totalRates: number;
  calendars: IPropertyCalendar[];
  isSaved: boolean;
  showPlaces: IShowPlace[];
  hasReviewed: boolean;
  quantity: number;
  tags: ITag[];
  isAdminActive: boolean;
  isActive: boolean;
  link: string;
  savesCount: number;
  similiarProperties: IProperty[];
  code: string;
  propertyRequest: any | null;
  originalPrice: number;
  isOpenYearRound: boolean;
  isClosed: boolean;
  zone: any;
  highlight: HIGHLIGHT;

  constructor({
    isSponsored,
    _id,
    merchant,
    isClosed,
    isGerBook,
    isKhonog,
    name,
    nameEng,
    description,
    descriptionEng,
    images,
    mainImage,
    level0,
    level1,
    level2,
    level3,
    additionalInformation,
    addressString,
    addressStringEng,
    longitude,
    latitude,
    location,
    bedsCount,
    price,
    placeOffers,
    discounts,
    cancelPolicies,
    maxPersonCount,
    checkInTime,
    checkOutTime,
    quiteStartTime,
    quiteTimeEnd,
    status,
    deletedAt,
    blockedDates,
    specialDates,
    propertyVersion,
    zone,
    avgRate,
    maxDiscount,
    createdAt,
    updatedAt,
    totalRates,
    calendars,
    showPlaces,
    hasReviewed,
    isSaved,
    quantity,
    tags,
    isAdminActive,
    isActive,
    link,
    savesCount,
    originalPrice,
    isOpenYearRound,
    similiarProperties,
    code,
    highlight,
    propertyRequest,
  }: IProperty) {
    this._id = _id;
    this.isClosed = isClosed;
    this.isSponsored = isSponsored;
    this.merchant = merchant;
    this.isGerBook = isGerBook;
    this.isKhonog = isKhonog;
    this.name = name;
    this.nameEng = nameEng;
    this.description = description;
    this.descriptionEng = descriptionEng;
    this.images = images;
    this.mainImage = mainImage;
    this.zone = zone;
    this.level0 = level0;
    this.level1 = level1;
    this.level2 = level2;
    this.level3 = level3;
    this.highlight = highlight;
    this.additionalInformation = additionalInformation;
    this.addressString = addressString;
    this.addressStringEng = addressStringEng;
    this.longitude = longitude;
    this.latitude = latitude;
    this.location = location;
    this.bedsCount = bedsCount;
    this.price = price;
    this.placeOffers = placeOffers;
    this.discounts = discounts;
    this.cancelPolicies = cancelPolicies;
    this.maxPersonCount = maxPersonCount;
    this.checkInTime = checkInTime;
    this.checkOutTime = checkOutTime;
    this.quiteStartTime = quiteStartTime;
    this.quiteTimeEnd = quiteTimeEnd;
    this.status = status;
    this.deletedAt = deletedAt;
    this.blockedDates = blockedDates;
    this.specialDates = specialDates;
    this.propertyVersion = propertyVersion;
    this.avgRate = avgRate;
    this.maxDiscount = maxDiscount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.totalRates = totalRates;
    this.calendars = calendars;
    this.showPlaces = showPlaces;
    this.hasReviewed = hasReviewed;
    this.isSaved = isSaved;
    this.quantity = quantity;
    this.tags = tags;
    this.isAdminActive = isAdminActive;
    this.isActive = isActive;
    this.link = link;
    this.savesCount = savesCount;
    this.similiarProperties = similiarProperties;
    this.code = code;
    this.propertyRequest = propertyRequest;
    this.originalPrice = originalPrice;
    this.isOpenYearRound = isOpenYearRound;
  }

  static fromJson(json: any): Property {
    return new Property(json);
  }
}
