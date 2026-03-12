import { ICategory } from "@/interfaces/category";

export class Category implements ICategory {
  _id: string;
  name: string;
  sort: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;

  constructor({ _id, name, sort, deletedAt, createdAt, updatedAt }: ICategory) {
    this._id = _id;
    this.name = name;
    this.sort = sort;
    this.deletedAt = deletedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new Category(json);
  }
}
