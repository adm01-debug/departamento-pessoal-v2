import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Zap, Plus, FileText, Users, Calendar, DollarSign, Clock, Settings } from "lucide-react";

interface QuickAction { id: string; label: string; icon: LucideIcon; onClick: () => void; variant?: "default" | "secondary" | "outline"; color?: string; description?: string; }
interface QuickActionsCardProps { title?: string; actions: QuickAction[]; columns?: 2 | 3 | 4; className?: string; }

export function QuickActionsCard({ title = "Ações Rápidas", actions, columns = 4, className }: QuickActionsCardProps) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 md:grid-cols-4" };
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" />{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-3", colClass[columns])}>
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <Button key={action.id} variant={action.variant || "outline"} className="h-auto py-4 flex-col gap-2" onClick={action.onClick}>
                <Icon className={cn("h-5 w-5", action.color)} /><span className="text-xs font-medium">{action.label}</span>
                {action.description && <span className="text-xs text-muted-foreground">{action.description}</span>}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default QuickActionsCard;
