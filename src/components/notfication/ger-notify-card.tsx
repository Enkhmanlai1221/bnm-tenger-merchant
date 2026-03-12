import {
  GerNotificationType,
  IGerNotification,
} from "@/interfaces/ger-notfication";
import { UserType } from "@/interfaces/user";
import { RootState } from "@/store";
import { formatDateTime } from "@/utils/time-age";
import { tv } from "@heroui/react";
import Link from "next/link";
import { useSelector } from "react-redux";

const notificationCard = tv({
  base: "flex gap-x-4 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800",
  variants: {
    type: {
      booking: "",
      property: "",
      default: "",
    },
    seen: {
      true: "bg-gray-200",
      false: "",
    },
  },
});

export function GerNotifyCard({ payload }: { payload: IGerNotification }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const cardClassName = notificationCard({
    type: payload.objectType as any,
    seen: payload.hasSeenList,
  });

  const urlPrefix =
    user?.type === UserType.MERCHANT ? "merchant-bookings" : "bookings";

  return (
    <>
      {{
        [GerNotificationType.BOOKING]: (
          <Link
            href={
              payload.object?._id
                ? `/${user?.type === UserType.MERCHANT ? "merchant-bookings" : "bookings"}/${payload.object?._id}`
                : "/"
            }
            target="_blank"
          >
            <div className={cardClassName}>
              <div className="flex-auto">
                <div className="flex items-baseline justify-between gap-x-4">
                  <p className="text-sm text-gray-900">{payload.description}</p>
                  <p className="flex-none text-xs text-gray-600">
                    <time dateTime={payload.createdAt}>
                      {formatDateTime(payload.createdAt)}
                    </time>
                  </p>
                </div>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {payload.object?.code}
                </p>
              </div>
            </div>
          </Link>
        ),
        [GerNotificationType.PROPERTY]: (
          <Link
            href={
              payload.object?._id
                ? `/${user?.type === UserType.MERCHANT ? "listings" : "stay"}/${payload.object?._id}`
                : "/"
            }
            target="_blank"
          >
            <div className={cardClassName}>
              <div className="flex-auto">
                <div className="flex items-baseline justify-between gap-x-4">
                  <p className="text-sm text-gray-900">{payload.description}</p>
                  <p className="flex-none text-xs text-gray-600">
                    <time dateTime={payload.createdAt}>
                      {formatDateTime(payload.createdAt)}
                    </time>
                  </p>
                </div>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {payload.object?.code}
                </p>
              </div>
            </div>
          </Link>
        ),
        [GerNotificationType.REVIEW]: (
          <Link
            href={
              payload.object?.property
                ? `/stays/${payload.object?.property}`
                : "/"
            }
            target="_blank"
          >
            <div className={cardClassName}>
              <div className="flex-auto">
                <div className="flex items-baseline justify-between gap-x-4">
                  <p className="text-sm text-gray-900">{payload.description}</p>
                  <p className="flex-none text-xs text-gray-600">
                    <time dateTime={payload.createdAt}>
                      {formatDateTime(payload.createdAt)}
                    </time>
                  </p>
                </div>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {payload.object?.code}
                </p>
              </div>
            </div>
          </Link>
        ),
      }[payload.objectType] || (
        <div className={cardClassName}>
          <div className="flex-auto">
            <div className="flex items-baseline justify-between gap-x-4">
              <p className="text-sm text-gray-900">{payload.title}</p>
              <p className="flex-none text-xs text-gray-600">
                <time dateTime={payload.createdAt}>
                  {formatDateTime(payload.createdAt)}
                </time>
              </p>
            </div>
            <p className="line-clamp-2 text-xs text-gray-600">
              {payload.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
