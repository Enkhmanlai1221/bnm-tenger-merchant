import { Snippet } from "@heroui/react";

export function TextLabel({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm/6 font-medium text-gray-900">{label}</div>
      <Snippet symbol={null} disableTooltip>
        {text}
      </Snippet>
    </div>
  );
}
