"use client";

import React, { ReactNode } from "react";

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

interface Props {
  variant?: "primary" | "secondary" | "default" | "light";
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
  onClick?: () => void;
  block?: boolean;
  disabled?: boolean;
  className?: string;
  width?: string;
}

const ActionIcon = React.forwardRef(
  (
    {
      type = "button",
      variant = "default",
      size = "sm",
      loading = false,
      children,
      onClick,
      className = "",
      disabled = false,
      block,
      width,
    }: Props & ButtonProps,
    ref,
  ) => {
    const disabledStyle =
      disabled || loading
        ? "opacity-50 cursor-not-allowed"
        : "transition ease-in-out duration-300 hover:cursor-pointer";

    const textSize = {
      xs: "text-sm",
      sm: "text-base",
      md: "text-lg",
      lg: "text-xl",
    };

    const padding = {
      xs: "px-1.5 py-0.5",
      sm: "px-2 py-1",
      md: "px-3 py-2",
      lg: "px-4 py-2",
    };

    const ring = {
      primary:
        "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500",
      secondary:
        "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-lime-500",
      default:
        "focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500",
      light: "",
    };

    const color = {
      primary: "text-white",
      secondary: "text-slate-700 dark:text-slate-200",
      default: "text-slate-700",
      light: "text-slate-700",
    };

    const backgroundColors = {
      primary:
        "bg-primary-600 hover:bg-primary-500 dark:bg-primary-800 dark:hover:bg-primary-500",
      secondary: "bg-lime-500",
      default: "bg-light-button",
      light: "",
    };

    const border = {
      primary: "border-none",
      secondary: "border border-lime-800 dark:border-white",
      default: "border border-black-200",
      light: "",
    };

    let baseClasses = [
      "inline-flex items-center justify-center align-middle rounded-md transition-all duration-800",
      textSize[size],
      padding[size],
      border[variant],
      backgroundColors[variant],
      color[variant],
      ring[variant],
      disabledStyle,
    ];

    if (className) {
      baseClasses = [...baseClasses, ...className.split(" ")];
    }
    if (block) {
      baseClasses = [...baseClasses, "block w-full"];
    }
    if (width) {
      baseClasses = [...baseClasses, width];
    }

    return (
      <button
        ref={ref as any}
        type={type}
        onClick={onClick}
        className={baseClasses.join(" ")}
        disabled={disabled || loading}
      >
        {loading ? (
          <span className="mr-2 inline-block">
            <svg
              className="h-[22px] w-[22px] animate-spin text-current transition-all"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  },
);

ActionIcon.displayName = "ActionIcon";

export default ActionIcon;
