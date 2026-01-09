import React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export function PageSizeSelect({ value, onChange, options = [10, 25, 50, 100], className }: PageSizeSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Exibir</span>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((size) => (
            <SelectItem key={size} value={String(size)}>{size}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">por página</span>
    </div>
  );
}
export default PageSizeSelect;
