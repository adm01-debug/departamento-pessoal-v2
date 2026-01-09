import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Table2 } from "lucide-react";

type ViewType = "grid" | "list" | "table";
interface DisplayModeToggleProps { value: ViewType; onChange: (value: ViewType) => void; views?: ViewType[]; className?: string; }

const viewIcons = { grid: LayoutGrid, list: List, table: Table2 };

export function DisplayModeToggle({ value, onChange, views = ["grid", "list"], className }: DisplayModeToggleProps) {
  return (
    <div className={cn("flex items-center border rounded-md", className)}>
      {views.map((view) => {
        const Icon = viewIcons[view];
        return (
          <Button key={view} variant={value === view ? "secondary" : "ghost"} size="icon" className="rounded-none first:rounded-l-md last:rounded-r-md" onClick={() => onChange(view)}>
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
}
export default DisplayModeToggle;
