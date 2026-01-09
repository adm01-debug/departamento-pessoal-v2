import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ListItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListItem({ title, description, icon, badge, trailing, showChevron = false, selected = false, disabled = false, onClick, className }: ListItemProps) {
  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg transition-colors", onClick && !disabled && "cursor-pointer hover:bg-muted", selected && "bg-muted", disabled && "opacity-50 cursor-not-allowed", className)} onClick={() => !disabled && onClick?.()}>
      {icon && <div className="flex-shrink-0 text-muted-foreground">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium truncate", description && "text-sm")}>{title}</span>
          {badge}
        </div>
        {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
      </div>
      {trailing && <div className="flex-shrink-0">{trailing}</div>}
      {showChevron && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
    </div>
  );
}
export default ListItem;
