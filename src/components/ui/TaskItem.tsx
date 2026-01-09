import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface TaskItemProps { title: string; description?: string; dueDate?: string; priority?: "high" | "medium" | "low"; completed?: boolean; onToggle?: () => void; onClick?: () => void; className?: string; }

export function TaskItem({ title, description, dueDate, priority, completed = false, onToggle, onClick, className }: TaskItemProps) {
  const priorityColors = { high: "bg-red-500", medium: "bg-yellow-500", low: "bg-blue-500" };
  return (
    <div className={cn("flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors", completed && "opacity-60", className)}>
      <Checkbox checked={completed} onCheckedChange={onToggle} className="mt-0.5" />
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2"><p className={cn("font-medium", completed && "line-through")}>{title}</p>{priority && <Badge className={priorityColors[priority]}>{priority}</Badge>}</div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {dueDate && <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Calendar className="h-3 w-3" />{dueDate}</p>}
      </div>
    </div>
  );
}
export default TaskItem;
