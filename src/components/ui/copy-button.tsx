import { Button } from "@heroui/react";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Button
      variant="solid"
      className="flex items-center gap-2"
      onPress={() => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }}
    >
      <IconCopy size={18} />
      <span className="text-base">{isCopied ? "Copied" : "Copy link"}</span>
    </Button>
  );
}
