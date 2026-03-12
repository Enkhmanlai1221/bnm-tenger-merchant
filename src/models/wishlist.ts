import { IMerchant } from "@/interfaces/merchant";
import { IProperty } from "@/interfaces/property";
import { IShowPlace } from "@/interfaces/show-place";
import { IWishlist } from "@/interfaces/wishlist";

export class Wishlist implements IWishlist {
  _id: string;
  merchant: IMerchant;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  user: string;
  property: IProperty;
  showPlace: IShowPlace;

  constructor({
    _id,
    merchant,
    createdAt,
    updatedAt,
    isSaved,
    user,
    property,
    showPlace,
  }: IWishlist) {
    this._id = _id;
    this.merchant = merchant;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isSaved = isSaved;
    this.user = user;
    this.property = property;
    this.showPlace = showPlace;
  }

  static fromJson(json: any): Wishlist {
    return new Wishlist(json);
  }
}
