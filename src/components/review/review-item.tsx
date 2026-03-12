/* eslint-disable @next/next/no-img-element */
import { IReview } from "@/interfaces/review";
import { formatDateTime } from "@/utils/time-age";
import { cn } from "@heroui/react";
import { StarRating } from "../ui/rate/rate";
import Image from "next/image";
const ReviewItem = ({
  payload,
  disableEllipsis = false,
}: {
  payload: IReview;
  disableEllipsis?: boolean;
}) => {
  return (
    <div className="flex space-x-4 text-sm text-gray-500 px-1">
      {payload.user.avatar?.url ? (
        <Image
          alt=""
          src={payload.user.avatar?.url}
          className="size-10 rounded-full object-cover"
          width={40}
          height={40}
        />
      ) : (
        <img alt="" src={"/no-avatar.webp"} className="size-10 rounded-full" />
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-950">
            {payload.user.firstName} {payload.user.lastName}
          </h3>
          <div className="flex items-center gap-x-1">
            <StarRating rating={payload.rate} />
          </div>
        </div>
        <p>
          <time>{formatDateTime(payload.createdAt)}</time>
        </p>
        <p
          className={cn(
            disableEllipsis ? "line-clamp-none" : "line-clamp-3",
            "text-sm/5 text-gray-500 text-justify",
          )}
        >
          {payload.text}
        </p>
      </div>
    </div>
  );
};

export { ReviewItem };
