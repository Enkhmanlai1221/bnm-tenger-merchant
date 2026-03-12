import React, { ReactNode } from "react";

type Props = {
  backgroundColors:
    | "red"
    | "blue"
    | "green"
    | "lime"
    | "indigo"
    | "pink"
    | "yellow"
    | "teal"
    | "gray"
    | "white";
  children?: ReactNode;
  iconColor?:
    | "red"
    | "blue"
    | "green"
    | "lime"
    | "indigo"
    | "pink"
    | "yellow"
    | "teal"
    | "gray"
    | "black";
  title?: string;
  time?: string;
  size?: "xs" | "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full";
};

const Badge = React.forwardRef(
  (
    {
      children,
      size = "sm",
      backgroundColors = "white",
      radius = "sm",
      iconColor = "black",
    }: Props,
    ref,
  ) => {
    const padding = {
      xs: "p-1",
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    };
    const color = {
      white: "white",
      red: "bg-red-100",
      blue: "bg-blue-100",
      green: "bg-green-100",
      lime: "bg-lime-100",
      indigo: "bg-indigo-100",
      pink: "bg-pink-100",
      yellow: "bg-yellow-100",
      teal: "bg-teal-100",
      gray: "bg-gray-200",
    };
    const textColor = {
      black: "black",
      red: "text-red-500",
      blue: "text-blue-500",
      green: "text-green-500",
      lime: "text-lime-500",
      indigo: "text-indigo-500",
      pink: "text-pink-500",
      yellow: "text-yellow-500",
      teal: "text-teal-500",
      gray: "text-gray-500",
    };
    const rounded = {
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    let baseClasses = [
      "w-fit h-fit",
      padding[size],
      color[backgroundColors],
      rounded[radius],
      textColor[iconColor],
    ];
    return (
      <span ref={ref as any} className={baseClasses.join(" ")}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
