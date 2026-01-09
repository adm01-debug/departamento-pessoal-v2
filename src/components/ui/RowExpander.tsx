import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface RowExpanderProps {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function RowExpander({ isExpanded, onToggle, className }: RowExpanderProps) {
  return (
    <Button variant="ghost" size="icon" className={cn("h-6 w-6", className)} onClick={onToggle}>
      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  );
}
export default RowExpander;
