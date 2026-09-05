import { cn } from "@/lib/utils";

/** Compact monospace block for showing a transition/config verbatim. */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-2xl os-glass px-4 py-3 font-mono text-[12px] leading-relaxed text-os-text-secondary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <code>{code}</code>
    </pre>
  );
}
