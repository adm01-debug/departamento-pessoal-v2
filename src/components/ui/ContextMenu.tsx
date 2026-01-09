import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

interface MenuItem { icon?: LucideIcon; label: string; onClick: () => void; variant?: "default" | "destructive"; }
interface ContextMenuProps { trigger: React.ReactNode; items: MenuItem[]; }

export function ContextMenu({ trigger, items }: ContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, i) => {
          if (item.label === "-") return <DropdownMenuSeparator key={i} />;
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={i} onClick={item.onClick} className={item.variant === "destructive" ? "text-destructive" : ""}>
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ContextMenu;
