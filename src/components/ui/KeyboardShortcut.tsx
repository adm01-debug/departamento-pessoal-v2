import React from "react";
import { cn } from "@/lib/utils";

interface KeyboardShortcutProps { keys: string[]; className?: string; }

export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <kbd className="px-2 py-1 bg-muted border rounded text-xs font-mono">{key}</kbd>
          {i < keys.length - 1 && <span className="text-muted-foreground">+</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
export default KeyboardShortcut;
