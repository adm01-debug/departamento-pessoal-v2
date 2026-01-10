import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MilestoneItem { name: string; progress: number; dueDate?: string; }
interface MilestoneTrackerProps { title?: string; milestones: MilestoneItem[]; className?: string; }

export function MilestoneTracker({ title = "Marcos", milestones, className }: MilestoneTrackerProps) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((m, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm"><span>{m.name}</span><span className="text-muted-foreground">{m.progress}%</span></div>
            <Progress value={m.progress} className="h-2" />
            {m.dueDate && <p className="text-xs text-muted-foreground">Prazo: {m.dueDate}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default MilestoneTracker;
