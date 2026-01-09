import React from "react";
import { cn } from "@/lib/utils";

interface HighlightProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
  caseSensitive?: boolean;
}

export function Highlight({ text, query, className, highlightClassName = "bg-yellow-200 dark:bg-yellow-800", caseSensitive = false }: HighlightProps) {
  if (!query.trim()) return <span className={className}>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, caseSensitive ? "g" : "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i} className={cn("px-0.5 rounded", highlightClassName)}>{part}</mark> : part
      )}
    </span>
  );
}
export default Highlight;
