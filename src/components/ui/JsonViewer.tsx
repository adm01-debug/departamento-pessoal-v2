import React from "react";
import { cn } from "@/lib/utils";

interface JsonViewerProps { data: object; className?: string; }

export function JsonViewer({ data, className }: JsonViewerProps) {
  return (
    <pre className={cn("bg-muted p-4 rounded-lg overflow-x-auto text-sm", className)}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
export default JsonViewer;
