import { BOOKING_STATUS } from "@/interfaces/booking";
import {
  IconArchive,
  IconCheck,
  IconClock,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconX,
} from "@tabler/icons-react";
import { tv } from "tailwind-variants";

const bookingStatusVariants = tv({
  base: [
    "inline-flex items-center gap-2 rounded-full font-medium ring-1",
    "transition-colors",
  ],
  variants: {
    status: {
      [BOOKING_STATUS.PAID]:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
      [BOOKING_STATUS.CANCELED]:
        "bg-red-50 text-red-700 ring-red-200",
      [BOOKING_STATUS.CANCELLED]:
        "bg-red-50 text-red-700 ring-red-200",
      [BOOKING_STATUS.PENDING]:
        "bg-amber-50 text-amber-700 ring-amber-200",
      [BOOKING_STATUS.COMPLETED]:
        "bg-blue-50 text-blue-700 ring-blue-200",
      [BOOKING_STATUS.ARCHIVED]:
        "bg-slate-100 text-slate-700 ring-slate-200",
      [BOOKING_STATUS.CONFIRMED]:
        "bg-cyan-50 text-cyan-700 ring-cyan-200",
      [BOOKING_STATUS.REFUNDED]:
        "bg-purple-50 text-purple-700 ring-purple-200",
    },
    size: {
      sm: "px-2.5 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-3.5 py-2 text-sm",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const statusDotVariants = tv({
  base: "rounded-full",
  variants: {
    status: {
      [BOOKING_STATUS.PAID]: "bg-emerald-500",
      [BOOKING_STATUS.CANCELED]: "bg-red-500",
      [BOOKING_STATUS.CANCELLED]: "bg-red-500",
      [BOOKING_STATUS.PENDING]: "bg-amber-500",
      [BOOKING_STATUS.COMPLETED]: "bg-blue-500",
      [BOOKING_STATUS.ARCHIVED]: "bg-slate-500",
      [BOOKING_STATUS.CONFIRMED]: "bg-cyan-500",
      [BOOKING_STATUS.REFUNDED]: "bg-purple-500",
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2 w-2",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export const statusLabels: Record<BOOKING_STATUS, string> = {
  [BOOKING_STATUS.PAID]: "Төлбөр төлөгдсөн",
  [BOOKING_STATUS.CANCELED]: "Цуцлагдсан",
  [BOOKING_STATUS.PENDING]: "Хүлээгдэж буй",
  [BOOKING_STATUS.COMPLETED]: "Гүйцээгдсэн",
  [BOOKING_STATUS.ARCHIVED]: "Архивлагдсан",
  [BOOKING_STATUS.CONFIRMED]: "Баталгаажсан",
  [BOOKING_STATUS.REFUNDED]: "Буцаалт хийгдсэн",
  [BOOKING_STATUS.CANCELLED]: "Цуцлагдсан",
};

function getStatusIcon(status: BOOKING_STATUS, size: "sm" | "md" | "lg") {
  const iconSize = size === "sm" ? 12 : 14;

  switch (status) {
    case BOOKING_STATUS.PAID:
      return <IconCheck size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.PENDING:
      return <IconClock size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.CANCELED:
    case BOOKING_STATUS.CANCELLED:
      return <IconX size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.COMPLETED:
      return <IconRosetteDiscountCheck size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.ARCHIVED:
      return <IconArchive size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.CONFIRMED:
      return <IconCheck size={iconSize} stroke={2.2} />;
    case BOOKING_STATUS.REFUNDED:
      return <IconRefresh size={iconSize} stroke={2.2} />;
    default:
      return <IconClock size={iconSize} stroke={2.2} />;
  }
}

export const BookingStatus = ({
  status,
  size = "sm",
  showIcon = true,
  showDot = false,
}: {
  status: BOOKING_STATUS;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showDot?: boolean;
}) => {

  const label =
    statusLabels[status]

  return (
    <div className={bookingStatusVariants({ status, size })}>
      {showDot && <span className={statusDotVariants({ status, size })} />}

      {showIcon && getStatusIcon(status, size)}

      <span className="leading-none">{label}</span>
    </div>
  );
};