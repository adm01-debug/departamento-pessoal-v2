import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye, Edit, Trash2, Copy, Download, LucideIcon } from "lucide-react";

interface Action { id: string; label: string; icon?: LucideIcon; onClick: () => void; variant?: "default" | "destructive"; disabled?: boolean; }
interface TableActionsProps { actions: Action[]; className?: string; size?: "sm" | "default"; }

const defaultIcons: Record<string, LucideIcon> = { view: Eye, edit: Edit, delete: Trash2, copy: Copy, download: Download };

export function TableActions({ actions, className, size = "sm" }: TableActionsProps) {
  if (actions.length <= 2) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {actions.map(action => { const Icon = action.icon || defaultIcons[action.id]; return (
          <Button key={action.id} variant={action.variant === "destructive" ? "destructive" : "ghost"} size={size === "sm" ? "icon" : "sm"} onClick={e => { e.stopPropagation(); action.onClick(); }} disabled={action.disabled} className={size === "sm" ? "h-8 w-8" : ""}>
            {Icon && <Icon className="h-4 w-4" />}{size !== "sm" && <span className="ml-1">{action.label}</span>}
          </Button>
        ); })}
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, i) => { const Icon = action.icon || defaultIcons[action.id]; const isDestructive = action.variant === "destructive"; return (
          <React.Fragment key={action.id}>
            {isDestructive && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={action.onClick} disabled={action.disabled} className={cn(isDestructive && "text-destructive focus:text-destructive")}>{Icon && <Icon className="h-4 w-4 mr-2" />}{action.label}</DropdownMenuItem>
          </React.Fragment>
        ); })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default TableActions;
