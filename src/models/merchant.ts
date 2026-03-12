import { IImage } from "@/interfaces/image";
import { IMerchant } from "@/interfaces/merchant";

export class Merchant implements IMerchant {
  _id: string;
  type: string;
  phone: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  registerNo: string;
  email: string;
  avatar: IImage;
  isActive: boolean;
  expiryHours: number;
  userSuspended: boolean;
  userTerminated: boolean;
  passwordExpired: boolean;
  passwordNeedChange: boolean;
  userStatus: string;
  userStatusDate: string;
  notification: boolean;
  deletedAt: string | null;
  roles: string[];
  merchantType: string;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
  sessionScope: string;
  password: string;
  notificationCount: number;
  country: string;
  city: string;
  postalCode: string;
  state: string;

  constructor({
    _id,
    type,
    phone,
    firstName,
    lastName,
    birthDate,
    gender,
    registerNo,
    email,
    avatar,
    isActive,
    expiryHours,
    userSuspended,
    userTerminated,
    passwordExpired,
    passwordNeedChange,
    userStatus,
    userStatusDate,
    notification,
    deletedAt,
    roles,
    merchantType,
    createdAt,
    updatedAt,
    sessionId,
    sessionScope,
    password,
    notificationCount,
    country,
    city,
    postalCode,
    state,
  }: IMerchant) {
    this._id = _id;
    this.type = type;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.gender = gender;
    this.registerNo = registerNo;
    this.email = email;
    this.avatar = avatar;
    this.isActive = isActive;
    this.expiryHours = expiryHours;
    this.userSuspended = userSuspended;
    this.userTerminated = userTerminated;
    this.passwordExpired = passwordExpired;
    this.passwordNeedChange = passwordNeedChange;
    this.userStatus = userStatus;
    this.userStatusDate = userStatusDate;
    this.notification = notification;
    this.deletedAt = deletedAt;
    this.roles = roles;
    this.merchantType = merchantType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.sessionId = sessionId;
    this.sessionScope = sessionScope;
    this.password = password;
    this.notificationCount = notificationCount;
    this.country = country;
    this.city = city;
    this.postalCode = postalCode;
    this.state = state;
  }

  static fromJson(json: any) {
    return new Merchant(json);
  }
}
