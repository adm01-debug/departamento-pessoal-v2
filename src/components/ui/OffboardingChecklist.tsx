import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface ChecklistItem { id: string; label: string; completed: boolean; critical?: boolean; }
interface OffboardingChecklistProps { title?: string; items: ChecklistItem[]; onToggle?: (id: string) => void; className?: string; }

export function OffboardingChecklist({ title = "Checklist de Desligamento", items, onToggle, className }: OffboardingChecklistProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between"><CardTitle className="text-base">{title}</CardTitle><span className="text-sm text-muted-foreground">{completedCount}/{items.length}</span></div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className={cn("flex items-center gap-3 p-2 rounded hover:bg-muted/50", item.critical && !item.completed && "bg-red-50")}>
            <Checkbox checked={item.completed} onCheckedChange={() => onToggle?.(item.id)} />
            <span className={cn("text-sm flex-1", item.completed && "line-through text-muted-foreground")}>{item.label}</span>
            {item.critical && !item.completed && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default OffboardingChecklist;
