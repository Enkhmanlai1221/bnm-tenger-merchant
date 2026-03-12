import { IImage } from "@/interfaces/image";
import { ITag } from "@/interfaces/tag";

export class Tag implements ITag {
  _id: string;
  name: string;
  icon: string;
  selectedIcon: string;
  sort: number;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    _id,
    name,
    sort,
    deletedAt,
    createdAt,
    updatedAt,
    icon,
    selectedIcon,
  }: ITag) {
    this._id = _id;
    this.name = name;
    this.sort = sort;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.icon = icon;
    this.selectedIcon = selectedIcon;
  }

  static fromJson(json: any) {
    return new Tag(json);
  }
}
