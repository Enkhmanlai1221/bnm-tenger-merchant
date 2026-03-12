import {
  ITransaction,
  PAYMENT_METHOD_TYPES,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from "@/interfaces/transaction";
import { IUser } from "@/interfaces/user";

export class Transaction implements ITransaction {
  _id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  type: TRANSACTION_TYPES;
  paymentMethod: PAYMENT_METHOD_TYPES;
  objectType: string;
  object: string;
  user: IUser | string;
  merchant: IUser | string;
  amount: number;
  currency: string;
  description: string;
  creditAccountType: string;
  creditAccountName: string;
  creditAccountNumber: string;
  creditAccountCurrency: string;
  debitAccountType: string;
  debitAccountName: string;
  debitAccountNumber: string;
  debitAccountCurrency: string;
  debitBankCode: string;
  debitBankBranch: string;
  debitBankAccountName: string;
  debitBankAccountNumber: string;
  debitBankAccountCurrency: string;
  creditBankCode: string;
  creditBankBranch: string;
  creditBankAccountName: string;
  creditBankAccountNumber: string;
  creditBankAccountCurrency: string;
  status: TRANSACTION_STATUS;
  statusDate: string;

  constructor(transaction: ITransaction) {
    this._id = transaction._id;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
    this.code = transaction.code;
    this.type = transaction.type;
    this.paymentMethod = transaction.paymentMethod;
    this.objectType = transaction.objectType;
    this.object = transaction.object;
    this.user = transaction.user;
    this.merchant = transaction.merchant;
    this.amount = transaction.amount;
    this.currency = transaction.currency;
    this.description = transaction.description;
    this.creditAccountType = transaction.creditAccountType;
    this.creditAccountName = transaction.creditAccountName;
    this.creditAccountNumber = transaction.creditAccountNumber;
    this.creditAccountCurrency = transaction.creditAccountCurrency;
    this.debitAccountType = transaction.debitAccountType;
    this.debitAccountName = transaction.debitAccountName;
    this.debitAccountNumber = transaction.debitAccountNumber;
    this.debitAccountCurrency = transaction.debitAccountCurrency;
    this.debitBankCode = transaction.debitBankCode;
    this.debitBankBranch = transaction.debitBankBranch;
    this.debitBankAccountName = transaction.debitBankAccountName;
    this.debitBankAccountNumber = transaction.debitBankAccountNumber;
    this.debitBankAccountCurrency = transaction.debitBankAccountCurrency;
    this.creditBankCode = transaction.creditBankCode;
    this.creditBankBranch = transaction.creditBankBranch;
    this.creditBankAccountName = transaction.creditBankAccountName;
    this.creditBankAccountNumber = transaction.creditBankAccountNumber;
    this.creditBankAccountCurrency = transaction.creditBankAccountCurrency;
    this.status = transaction.status;
    this.statusDate = transaction.statusDate;
  }

  static fromJson(json: any) {
    return new Transaction(json);
  }
}
