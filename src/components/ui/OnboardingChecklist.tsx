import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem { id: string; label: string; completed: boolean; }
interface OnboardingChecklistProps { title?: string; items: ChecklistItem[]; onToggle?: (id: string) => void; className?: string; }

export function OnboardingChecklist({ title = "Checklist de Admissão", items, onToggle, className }: OnboardingChecklistProps) {
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
          <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
            <Checkbox checked={item.completed} onCheckedChange={() => onToggle?.(item.id)} />
            <span className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>{item.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default OnboardingChecklist;
