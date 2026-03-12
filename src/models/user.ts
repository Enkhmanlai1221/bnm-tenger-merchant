import { IImage } from "@/interfaces/image";
import {
  IUser,
  MERCHANT_TYPE,
  UserType,
  VerifiedMethodType,
} from "@/interfaces/user";

export class User implements IUser {
  appType: string;
  avatar: IImage | null;
  birthDate: string;
  createdAt: string;
  deletedAt: string | null;
  email: string;
  expiryHours: number;
  firstName: string;
  gender: string;
  isActive: boolean;
  lastName: string;
  notification: boolean;
  notificationCount: number;
  passwordExpired: boolean;
  passwordNeedChange: boolean;
  phone: string;
  registerNo: string;
  roles: string[];
  sessionId: string;
  sessionScope: string;
  type: UserType;
  updatedAt: string;
  userStatus: string;
  userStatusDate: string;
  userSuspended: boolean;
  userTerminated: boolean;
  _id: string;
  deviceToken: string;
  password: string;
  facebookLink: string;
  viberLink: string;
  telegramLink: string;
  lineLink: string;
  whatsAppLink: string;
  code: string;
  verifiedMethod: VerifiedMethodType | null;
  isVerified: boolean;
  bank: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  contract: string;
  merchantType: MERCHANT_TYPE;

  constructor({
    _id,
    type,
    createdAt,
    email,
    isActive,
    expiryHours,
    userSuspended,
    userTerminated,
    passwordExpired,
    passwordNeedChange,
    userStatus,
    userStatusDate,
    notification,
    notificationCount,
    deletedAt,
    roles,
    appType,
    updatedAt,
    deviceToken,
    sessionId,
    sessionScope,
    password,
    avatar,
    birthDate,
    firstName,
    gender,
    lastName,
    phone,
    registerNo,
    facebookLink,
    viberLink,
    telegramLink,
    lineLink,
    whatsAppLink,
    code,
    verifiedMethod,
    isVerified,
    bank,
    bankAccount,
    bankAccountName,
    merchantType,
    contract,
  }: IUser) {
    this._id = _id;
    this.type = type;
    this.email = email;
    this.isActive = isActive;
    this.expiryHours = expiryHours;
    this.userSuspended = userSuspended;
    this.userTerminated = userTerminated;
    this.passwordExpired = passwordExpired;
    this.passwordNeedChange = passwordNeedChange;
    this.userStatus = userStatus;
    this.userStatusDate = userStatusDate;
    this.notification = notification;
    this.notificationCount = notificationCount;
    this.deletedAt = deletedAt;
    this.roles = roles;
    this.merchantType = merchantType;
    this.appType = appType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deviceToken = deviceToken;
    this.sessionId = sessionId;
    this.sessionScope = sessionScope;
    this.contract = contract;
    this.password = password;
    this.avatar = avatar;
    this.birthDate = birthDate;
    this.firstName = firstName;
    this.gender = gender;
    this.lastName = lastName;
    this.phone = phone;
    this.registerNo = registerNo;
    this.facebookLink = facebookLink;
    this.viberLink = viberLink;
    this.telegramLink = telegramLink;
    this.lineLink = lineLink;
    this.whatsAppLink = whatsAppLink;
    this.code = code;
    this.verifiedMethod = verifiedMethod;
    this.isVerified = isVerified;
    this.bank = bank;
    this.bankAccount = bankAccount;
    this.bankAccountName = bankAccountName;
  }

  static fromJson(json: any) {
    return new User(json);
  }
}
