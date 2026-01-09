import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

interface SortableHeaderProps {
  label: string;
  sortDirection?: SortDirection;
  onSort?: () => void;
  className?: string;
}

export function SortableHeader({ label, sortDirection, onSort, className }: SortableHeaderProps) {
  const Icon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button className={cn("flex items-center gap-1 hover:text-foreground transition-colors", className)} onClick={onSort}>
      {label}
      <Icon className={cn("h-4 w-4", sortDirection ? "text-foreground" : "text-muted-foreground")} />
    </button>
  );
}
export default SortableHeader;
