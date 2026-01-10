import React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps { code: string; language?: string; className?: string; }

export function CodeBlock({ code, language = "javascript", className }: CodeBlockProps) {
  return (
    <pre className={cn("bg-muted p-4 rounded-lg overflow-x-auto", className)}>
      <code className={`language-${language} text-sm`}>{code}</code>
    </pre>
  );
}
export default CodeBlock;
