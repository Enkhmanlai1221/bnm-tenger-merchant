import { IFaq } from "@/interfaces/faq";

export class Faq implements IFaq {
  _id: string;
  answer: string;
  appType: string;
  createdAt: string;
  deletedAt: string | null;
  isActive: boolean;
  parent: null;
  question: string;
  sort: number;
  updatedAt: string;

  constructor({
    _id,
    answer,
    appType,
    createdAt,
    deletedAt,
    isActive,
    parent,
    question,
    sort,
    updatedAt,
  }: IFaq) {
    this._id = _id;
    this.answer = answer;
    this.appType = appType;
    this.createdAt = createdAt;
    this.sort = sort;
    this.deletedAt = deletedAt;
    this.isActive = isActive;
    this.parent = parent;
    this.question = question;
    this.updatedAt = updatedAt;
  }

  static fromJson(json: any) {
    return new Faq(json);
  }
}
