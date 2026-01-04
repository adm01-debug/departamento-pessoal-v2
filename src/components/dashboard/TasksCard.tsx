import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ListTodo, Plus, Clock, AlertCircle } from "lucide-react";

interface Task { id: string; title: string; completed: boolean; priority?: "low" | "medium" | "high"; dueDate?: Date; }
interface TasksCardProps { tasks: Task[]; onToggle?: (id: string) => void; onAdd?: () => void; maxHeight?: number; className?: string; }

const priorityColors = { low: "bg-blue-100 text-blue-700", medium: "bg-yellow-100 text-yellow-700", high: "bg-red-100 text-red-700" };

export function TasksCard({ tasks, onToggle, onAdd, maxHeight = 300, className }: TasksCardProps) {
  const pending = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div><CardTitle className="text-base flex items-center gap-2"><ListTodo className="h-4 w-4" />Tarefas</CardTitle><p className="text-xs text-muted-foreground">{pending} pendentes • {completed} concluídas</p></div>
        {onAdd && <Button variant="ghost" size="icon" onClick={onAdd}><Plus className="h-4 w-4" /></Button>}
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa</p> : (
          <ScrollArea style={{ maxHeight }}>
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className={cn("flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50", task.completed && "opacity-50")}>
                  <Checkbox checked={task.completed} onCheckedChange={() => onToggle?.(task.id)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", task.completed && "line-through")}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.priority && <Badge variant="secondary" className={cn("text-xs", priorityColors[task.priority])}>{task.priority}</Badge>}
                      {task.dueDate && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{task.dueDate.toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
export default TasksCard;
