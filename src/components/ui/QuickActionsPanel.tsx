import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickAction { icon: LucideIcon; label: string; onClick: () => void; variant?: "default" | "outline" | "secondary"; }
interface QuickActionsPanelProps { actions: QuickAction[]; className?: string; }

export function QuickActionsPanel({ actions, className }: QuickActionsPanelProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <Button key={i} variant={action.variant || "outline"} size="sm" onClick={action.onClick}>
            <Icon className="h-4 w-4 mr-2" />{action.label}
          </Button>
        );
      })}
    </div>
  );
}
export default QuickActionsPanel;
