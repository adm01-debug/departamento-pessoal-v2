import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface InputGroupProps { prefix?: React.ReactNode; suffix?: React.ReactNode; children?: React.ReactNode; className?: string; }

export function InputGroup({ prefix, suffix, children, className }: InputGroupProps) {
  return (
    <div className={cn("flex", className)}>
      {prefix && <span className="inline-flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">{prefix}</span>}
      <div className={cn("flex-1", prefix && "rounded-l-none", suffix && "rounded-r-none")}>{children}</div>
      {suffix && <span className="inline-flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">{suffix}</span>}
    </div>
  );
}
export default InputGroup;
