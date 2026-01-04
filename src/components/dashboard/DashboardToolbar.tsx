import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarItem { id: string; icon: LucideIcon; label: string; onClick: () => void; disabled?: boolean; active?: boolean; variant?: "default" | "destructive"; }
interface ToolbarGroup { items: ToolbarItem[]; }
interface DashboardToolbarProps { groups: ToolbarGroup[]; className?: string; size?: "sm" | "default" | "lg"; }

export function DashboardToolbar({ groups, className, size = "default" }: DashboardToolbarProps) {
  const sizeClass = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 p-1 bg-muted/50 rounded-lg", className)}>
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <Separator orientation="vertical" className="h-6 mx-1" />}
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button variant={item.active ? "secondary" : item.variant === "destructive" ? "destructive" : "ghost"} size="icon" className={sizeClass} onClick={item.onClick} disabled={item.disabled}>
                      <Icon className={iconSize} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>{item.label}</p></TooltipContent>
                </Tooltip>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </TooltipProvider>
  );
}
export default DashboardToolbar;
