import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";

interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  triggerClassName?: string;
}

export function ActionMenu({ items, orientation = "vertical", className, triggerClassName }: ActionMenuProps) {
  const Icon = orientation === "horizontal" ? MoreHorizontal : MoreVertical;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-8 w-8", triggerClassName)}>
          <Icon className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        {items.map((item, i) => item.separator ? (
          <DropdownMenuSeparator key={i} />
        ) : (
          <DropdownMenuItem key={i} onClick={item.onClick} disabled={item.disabled} className={cn(item.destructive && "text-destructive focus:text-destructive")}>
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ActionMenu;
