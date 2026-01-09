import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface QuickFilterOption {
  value: string;
  label: string;
  count?: number;
}

interface QuickFilterProps {
  options: QuickFilterOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function QuickFilter({ options, value, onChange, className }: QuickFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Badge variant={!value ? "default" : "outline"} className="cursor-pointer" onClick={() => onChange(undefined)}>Todos</Badge>
      {options.map((option) => (
        <Badge key={option.value} variant={value === option.value ? "default" : "outline"} className="cursor-pointer" onClick={() => onChange(option.value)}>
          {option.label}
          {option.count !== undefined && <span className="ml-1 opacity-70">({option.count})</span>}
        </Badge>
      ))}
    </div>
  );
}
export default QuickFilter;
