import { cn } from "@/utils";
import styles from "./style.module.css";

export function RenderTiptap({
  content,
  className,
  ...rest
}: {
  content: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(styles.tiptap, className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
