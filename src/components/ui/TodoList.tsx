import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: string;
}

interface TodoListProps {
  items: TodoItem[];
  title?: string;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  className?: string;
}

export function TodoList({ items, title = "Tarefas", onToggle, onDelete, onAdd, className }: TodoListProps) {
  const priorityColors = { high: "bg-red-500", medium: "bg-yellow-500", low: "bg-blue-500" };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {onAdd && <Button variant="ghost" size="icon" onClick={onAdd}><Plus className="h-4 w-4" /></Button>}
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa</p>}
        {items.map((item) => (
          <div key={item.id} className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50", item.completed && "opacity-60")}>
            <Checkbox checked={item.completed} onCheckedChange={() => onToggle?.(item.id)} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm truncate", item.completed && "line-through")}>{item.title}</p>
              {item.dueDate && <p className="text-xs text-muted-foreground">{item.dueDate}</p>}
            </div>
            {item.priority && <span className={cn("w-2 h-2 rounded-full", priorityColors[item.priority])} />}
            {onDelete && <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => onDelete(item.id)}><Trash2 className="h-3 w-3" /></Button>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default TodoList;
