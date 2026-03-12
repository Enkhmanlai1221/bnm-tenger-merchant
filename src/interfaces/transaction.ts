import { Transaction } from "@/models/transaction";

export type ITransaction = Transaction;

export enum TRANSACTION_TYPES {
  BOOKING = "BOOKING", // zahialga
  REFUND = "REFUND", // butsaalt
  FEE = "FEE", // systemiin shimtgel
  PROFIT = "PROFIT", // merchant ashig
}

export enum TRANSACTION_STATUS {
  CONFIRMED = "CONFIRMED",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
}

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.CONFIRMED]: {
    code: "CONFIRMED",
    name: "Амжилттай",
    nameEng: "transaction_status_confirmed",
    color: "green",
  },
  [TRANSACTION_STATUS.PENDING]: {
    code: "PENDING",
    name: "Хянагдаж байна",
    nameEng: "transaction_status_pending",
    color: "yellow",
  },
  [TRANSACTION_STATUS.CANCELED]: {
    code: "CANCELED",
    name: "Цуцалсан",
    nameEng: "transaction_status_canceled",
    color: "red",
  },
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.BOOKING]: {
    code: "BOOKING",
    name: "Захиалга",
    nameEng: "transaction_type_booking",
    color: "blue",
  },
  [TRANSACTION_TYPES.REFUND]: {
    code: "REFUND",
    name: "Буцаалт",
    nameEng: "transaction_type_refund",
    color: "red",
  },
  [TRANSACTION_TYPES.FEE]: {
    code: "FEE",
    name: "Системийн шилжилт",
    nameEng: "transaction_type_fee",
    color: "blue",
  },
  [TRANSACTION_TYPES.PROFIT]: {
    code: "PROFIT",
    name: "Merchant ашиглалт",
    nameEng: "transaction_type_profit",
    color: "green",
  },
};

export enum PAYMENT_METHOD_TYPES {
  QPAY = "QPAY",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}
