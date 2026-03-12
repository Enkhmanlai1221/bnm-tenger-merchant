import {
  ITransaction,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPES,
} from "@/interfaces/transaction";
import { useLanguage } from "@/providers/language";
import { formatDateTime } from "@/utils/time-age";
import { tv } from "tailwind-variants";
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconReceipt2,
  IconWallet,
} from "@tabler/icons-react";

const cardVariants = tv({
  base: [
    "group rounded-2xl border p-4 transition-all duration-200",
    "bg-white/95 backdrop-blur-sm",
    "hover:shadow-md hover:-translate-y-[1px]",
  ],
  variants: {
    type: {
      [TRANSACTION_TYPES.BOOKING]:
        "border-emerald-100 bg-emerald-50/40",
      [TRANSACTION_TYPES.PROFIT]:
        "border-blue-100 bg-blue-50/40",
      [TRANSACTION_TYPES.REFUND]:
        "border-amber-100 bg-amber-50/40",
      [TRANSACTION_TYPES.FEE]:
        "border-red-100 bg-red-50/40",
    },
  },
});

const badgeVariants = tv({
  base: "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
  variants: {
    type: {
      [TRANSACTION_TYPES.BOOKING]: "bg-emerald-100 text-emerald-700",
      [TRANSACTION_TYPES.PROFIT]: "bg-blue-100 text-blue-700",
      [TRANSACTION_TYPES.REFUND]: "bg-amber-100 text-amber-700",
      [TRANSACTION_TYPES.FEE]: "bg-red-100 text-red-700",
    },
  },
});

const iconWrapVariants = tv({
  base: "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
  variants: {
    type: {
      [TRANSACTION_TYPES.BOOKING]:
        "bg-emerald-100 text-emerald-700 ring-emerald-200",
      [TRANSACTION_TYPES.PROFIT]:
        "bg-blue-100 text-blue-700 ring-blue-200",
      [TRANSACTION_TYPES.REFUND]:
        "bg-amber-100 text-amber-700 ring-amber-200",
      [TRANSACTION_TYPES.FEE]:
        "bg-red-100 text-red-700 ring-red-200",
    },
  },
});

function getTransactionIcon(type: TRANSACTION_TYPES) {
  switch (type) {
    case TRANSACTION_TYPES.BOOKING:
      return <IconArrowDownLeft size={20} stroke={2} />;
    case TRANSACTION_TYPES.PROFIT:
      return <IconWallet size={20} stroke={2} />;
    case TRANSACTION_TYPES.REFUND:
      return <IconArrowUpRight size={20} stroke={2} />;
    case TRANSACTION_TYPES.FEE:
      return <IconReceipt2 size={20} stroke={2} />;
    default:
      return <IconReceipt2 size={20} stroke={2} />;
  }
}

function isPositiveTransaction(type: TRANSACTION_TYPES) {
  return (
    type === TRANSACTION_TYPES.BOOKING || type === TRANSACTION_TYPES.PROFIT
  );
}

export function TransactionCard(transaction: ITransaction) {
  return <TransactionCardContent transaction={transaction} />;
}

const TransactionTypeLabel = ({ type }: { type: TRANSACTION_TYPES }) => {
  const { translate } = useLanguage();

  return (
    <span>
      {translate(
        TRANSACTION_TYPE_LABELS[type]?.name || ""
      )}
    </span>
  );
};

function TransactionCardContent({
  transaction,
}: {
  transaction: ITransaction;
}) {
  const { currencyRate } = useLanguage();
  const { type } = transaction;

  const isPositive = isPositiveTransaction(type);
  const amountText = `${isPositive ? "+" : "-"} ${currencyRate(transaction.amount)}`;

  return (
    <div className={cardVariants({ type })}>
      <div className="flex items-start gap-3">
        <div className={iconWrapVariants({ type })}>
          {getTransactionIcon(type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  <TransactionTypeLabel type={type} />
                </h3>
                {/* <span className={badgeVariants({ type })}>
                  {TRANSACTION_TYPE_LABELS[type]?.name}
                </span> */}
              </div>

              {transaction.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {transaction.description}
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <div
                className={[
                  "text-sm font-semibold",
                  isPositive ? "text-emerald-600" : "text-red-500",
                ].join(" ")}
              >
                {amountText}
              </div>
              <div className="mt-1 text-xs text-gray-400">
                {formatDateTime(transaction.statusDate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}