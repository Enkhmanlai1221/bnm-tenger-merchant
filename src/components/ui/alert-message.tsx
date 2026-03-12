import { cn } from "@/utils";
import { IconAlertCircle, IconExclamationCircle } from "@tabler/icons-react";
import { useMemo } from "react";

const AlertMessage = ({
  type,
  message,
  className,
}: {
  type?: "error" | "info" | "warning";
  message: string;
  className?: string;
}) => {
  const color = useMemo(() => {
    switch (type) {
      case "error":
        return {
          icon: "text-red-400",
          text: "text-red-800",
          background: "bg-red-50",
        };
      case "warning":
        return {
          icon: "text-yellow-400",
          text: "text-yellow-800",
          background: "bg-yellow-50",
        };
      case "info":
        return {
          icon: "text-blue-400",
          text: "text-blue-800",
          background: "bg-blue-50",
        };
      default:
        return {
          icon: "text-red-400",
          text: "text-red-800",
          background: "bg-red-50",
        };
    }
  }, [type]);

  const icon = useMemo(() => {
    switch (type) {
      case "error":
        return {
          name: "close-circle",
        };
      case "warning":
        return {
          name: "warning",
        };
      case "info":
        return {
          name: "information-circle",
        };
      default:
        return {
          name: "close-circle",
        };
    }
  }, [type]);

  return (
    <div className={cn(["rounded-md p-2", color.background, className || ""])}>
      <div className="flex items-center justify-between">
        {
          {
            warning: (
              <div className="flex items-center">
                <IconAlertCircle className="w-6 h-6 text-yellow-800" />
              </div>
            ),
            info: (
              <div className="flex items-center">
                <IconExclamationCircle className="w-6 h-6 text-blue-800" />
              </div>
            ),
            error: (
              <div className="flex items-center">
                <IconAlertCircle className="w-6 h-6 text-red-800" />
              </div>
            ),
          }[type || "info"]
        }
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={cn(["text-sm", color.text])}>{message}</p>
        </div>
      </div>
    </div>
  );
};

AlertMessage.displayName = "AlertMessage";

export default AlertMessage;
