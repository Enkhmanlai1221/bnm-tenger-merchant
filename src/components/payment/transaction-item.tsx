/* eslint-disable @next/next/no-img-element */
import React from "react";
import Badge from "../ui/badge/badge-icon";
import { IconAlertTriangle, IconLoader } from "@tabler/icons-react";

type Props = {
  payload: any;
};

const TransactionItem = ({ payload }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-x-3 items-center">
          {payload.type === "ACCEPTED" && (
            <Badge backgroundColors={"blue"} iconColor="blue" size="md">
              <img src="arrow-circle-right-up.svg" alt="" />
            </Badge>
          )}
          {payload.type === "REJECTED" && (
            <Badge backgroundColors={"red"} iconColor="red" size="md">
              <IconAlertTriangle size={24} />
            </Badge>
          )}
          {payload.type === "PENDING" && (
            <Badge backgroundColors={"yellow"} iconColor="yellow" size="md">
              <IconLoader size={24} />
            </Badge>
          )}
          {payload.type === "FEE" && (
            <Badge backgroundColors={"gray"} iconColor="gray" size="md">
              <img src="fee-icon.svg" alt="" />
            </Badge>
          )}
          <div className="flex flex-col items-start">
            <span className="text-base font-medium text-gray-800">
              {payload.title}
            </span>
            <span className="text-xs font-light text-gray-500">
              {payload.description}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {payload.type === "ACCEPTED" ? (
            <span className="text-base font-medium text-gray-800">
              +{payload.price}$
            </span>
          ) : (
            <span className="text-base font-medium text-red-500">
              {payload.price}$
            </span>
          )}
          <span className="text-xs font-light text-gray-500">
            {payload.date}
          </span>
        </div>
      </div>
    </div>
  );
};

export { TransactionItem };
