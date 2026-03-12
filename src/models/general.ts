import { IGeneral } from "@/interfaces/general";

export class General implements IGeneral {
  categories: any[];
  carts: any[];
  availableTags: {
    _id: string;
    name: string;
    icon: string;
    count: number;
  }[];
  indexedAvailableTags: {
    [key: string]: {
      _id: string;
      name: string;
      icon: string;
      count: number;
    };
  };
  drawer: {
    sidebar: boolean;
    search: boolean;
    filter: boolean;
    category: boolean;
    cart: boolean;
  };
  authModal: boolean;
  notificationCount: number;

  constructor({
    categories,
    carts,
    drawer,
    availableTags,
    indexedAvailableTags,
    authModal,
    notificationCount,
  }: IGeneral) {
    this.categories = categories;
    this.carts = carts;
    this.drawer = drawer;
    this.availableTags = availableTags;
    this.indexedAvailableTags = indexedAvailableTags;
    this.authModal = authModal;
    this.notificationCount = notificationCount;
  }

  static fromJson(json: any) {
    return new General(json);
  }
}
