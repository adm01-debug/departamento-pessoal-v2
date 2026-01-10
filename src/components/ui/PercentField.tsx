import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PercentFieldProps { value: number; onChange: (value: number) => void; className?: string; }

export function PercentField({ value, onChange, className }: PercentFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={0} max={100} className="pr-8" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
    </div>
  );
}
export default PercentField;
