"use client";

import { ReactNode } from "react";

interface Props {
  type?: "confirmed" | "pending" | "paid" | "canceled";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  width?: string;
}

const Tag = ({ children, type = "paid", size = "sm" }: Props) => {
  const textSize = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-md",
    lg: "text-xl",
  };

  const padding = {
    xs: "px-1.5 py-0.5",
    sm: "px-3.5 py-2.5",
    md: "px-3 py-1",
    lg: "px-4 py-1",
  };

  const border = {
    confirmed: "",
    pending: "",
    paid: "",
    canceled: "",
  };

  const backgroundColors = {
    confirmed: "bg-green-50",
    pending: "bg-orange-50",
    paid: "bg-blue-50",
    canceled: "bg-red-50",
  };

  const color = {
    confirmed: "text-green-600",
    pending: "text-orange-600",
    paid: "text-blue-600",
    canceled: "text-red-600",
  };

  const baseClasses = [
    "inline-flex items-center rounded-full font-medium",
    textSize[size],
    padding[size],
    border[type],
    backgroundColors[type],
    color[type],
  ];

  return <span className={baseClasses.join(" ")}>{children}</span>;
};

export default Tag;
