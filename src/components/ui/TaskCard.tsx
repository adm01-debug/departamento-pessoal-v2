import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TaskCardProps { title: string; description?: string; status: "todo" | "progress" | "done"; priority?: "low" | "medium" | "high"; dueDate?: string; className?: string; }

export function TaskCard({ title, description, status, priority, dueDate, className }: TaskCardProps) {
  const icons = { todo: Circle, progress: Clock, done: CheckCircle };
  const colors = { low: "bg-blue-100 text-blue-800", medium: "bg-yellow-100 text-yellow-800", high: "bg-red-100 text-red-800" };
  const Icon = icons[status];
  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 mt-0.5", status === "done" ? "text-green-500" : "text-muted-foreground")} />
          <div className="flex-1">
            <h4 className={cn("font-medium", status === "done" && "line-through text-muted-foreground")}>{title}</h4>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            <div className="flex gap-2 mt-2">
              {priority && <Badge variant="secondary" className={colors[priority]}>{priority}</Badge>}
              {dueDate && <span className="text-xs text-muted-foreground">{dueDate}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default TaskCard;
