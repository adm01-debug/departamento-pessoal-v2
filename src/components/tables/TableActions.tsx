import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye, Edit, Trash2, Copy, Download, Share, LucideIcon } from "lucide-react";

interface Action { id: string; label: string; icon?: LucideIcon; onClick: () => void; variant?: "default" | "destructive"; disabled?: boolean; hidden?: boolean; }
interface TableActionsProps { actions: Action[]; variant?: "dropdown" | "inline"; size?: "sm" | "default"; className?: string; }

const defaultIcons: Record<string, LucideIcon> = { view: Eye, edit: Edit, delete: Trash2, copy: Copy, download: Download, share: Share };

export function TableActions({ actions, variant = "dropdown", size = "sm", className }: TableActionsProps) {
  const visibleActions = actions.filter(a => !a.hidden);
  if (visibleActions.length === 0) return null;

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)} onClick={e => e.stopPropagation()}>
        {visibleActions.map(action => {
          const Icon = action.icon || defaultIcons[action.id];
          return (
            <Button key={action.id} variant={action.variant === "destructive" ? "destructive" : "ghost"} size={size === "sm" ? "icon" : "default"} className={size === "sm" ? "h-8 w-8" : ""} onClick={action.onClick} disabled={action.disabled}>
              {Icon && <Icon className={cn("h-4 w-4", size !== "sm" && "mr-2")} />}
              {size !== "sm" && action.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visibleActions.map((action, i) => {
            const Icon = action.icon || defaultIcons[action.id];
            const isDestructive = action.variant === "destructive";
            return (
              <React.Fragment key={action.id}>
                {isDestructive && i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={action.onClick} disabled={action.disabled} className={isDestructive ? "text-destructive focus:text-destructive" : ""}>
                  {Icon && <Icon className="h-4 w-4 mr-2" />}{action.label}
                </DropdownMenuItem>
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export default TableActions;
