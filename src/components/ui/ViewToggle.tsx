import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Table2 } from "lucide-react";

type ViewMode = "grid" | "list" | "table";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  options?: ViewMode[];
  className?: string;
}

const icons = { grid: LayoutGrid, list: List, table: Table2 };

export function ViewToggle({ value, onChange, options = ["grid", "list"], className }: ViewToggleProps) {
  return (
    <div className={cn("flex border rounded-lg", className)}>
      {options.map((mode) => {
        const Icon = icons[mode];
        return (
          <Button key={mode} variant={value === mode ? "secondary" : "ghost"} size="icon" className="rounded-none first:rounded-l-lg last:rounded-r-lg" onClick={() => onChange(mode)}>
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
export default ViewToggle;
