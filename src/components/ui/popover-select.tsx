import { Popover } from "@headlessui/react";
import { ReactNode } from "react";

export default function PopoverSelect({
  options,
  children,
  value,
  onChange,
}: {
  options: { label: string; code: string }[];
  children?: ReactNode;
  value?: string;
  onChange?: (e: string) => void;
}) {
  return (
    <div className="flex rounded-md border items-center gap-1 h-min px-2 pb-0.5 pt-1">
      <Popover className="relative text-primary-600 min-w-10">
        <Popover.Button>{children || value || options[0].label}</Popover.Button>
        <Popover.Panel className="flex flex-col z-50">
          {({ close }) => (
            <div className="bg-gray-200 flex flex-col gap-y-[1px] border w-16 rounded-md overflow-hidden">
              {options.map((item, index) => {
                return (
                  <button
                    key={index}
                    className="bg-white hover:bg-primary-100 text-sm"
                    onClick={() => {
                      onChange?.(item.label || "");
                      close();
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </Popover.Panel>
      </Popover>
    </div>
  );
}
