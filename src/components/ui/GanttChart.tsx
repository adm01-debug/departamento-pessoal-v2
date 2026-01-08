import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { format, addDays, differenceInDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  color?: string;
  dependencies?: string[];
}

interface GanttChartProps {
  tasks: GanttTask[];
  className?: string;
  startDate?: Date;
  onTaskClick?: (task: GanttTask) => void;
}

export function GanttChart({ tasks, className, startDate: propStart, onTaskClick }: GanttChartProps) {
  const [viewStart, setViewStart] = useState(propStart || startOfWeek(new Date(), { locale: ptBR }));
  const [zoom, setZoom] = useState(1);

  const days = useMemo(() => {
    const end = addDays(viewStart, Math.floor(28 / zoom));
    return eachDayOfInterval({ start: viewStart, end });
  }, [viewStart, zoom]);

  const dayWidth = 40 * zoom;

  const getTaskPosition = (task: GanttTask) => {
    const startOffset = differenceInDays(task.startDate, viewStart);
    const duration = differenceInDays(task.endDate, task.startDate) + 1;
    return { left: startOffset * dayWidth, width: duration * dayWidth };
  };

  const prevWeek = () => setViewStart(addDays(viewStart, -7));
  const nextWeek = () => setViewStart(addDays(viewStart, 7));
  const zoomIn = () => setZoom(Math.min(zoom + 0.25, 2));
  const zoomOut = () => setZoom(Math.max(zoom - 0.25, 0.5));

  return (
    <div className={cn("bg-card rounded-lg border overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
          <span className="text-sm font-medium">{format(viewStart, "MMM yyyy", { locale: ptBR })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut}><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={zoomIn}><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex">
        <div className="w-48 flex-shrink-0 border-r">
          <div className="h-10 border-b bg-muted/50 px-2 flex items-center text-sm font-medium">Tarefa</div>
          {tasks.map(task => (
            <div key={task.id} className="h-10 border-b px-2 flex items-center text-sm truncate cursor-pointer hover:bg-accent" onClick={() => onTaskClick?.(task)}>{task.name}</div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto">
          <div className="flex h-10 border-b bg-muted/50">
            {days.map(day => (
              <div key={day.toISOString()} className="flex-shrink-0 border-r text-center text-xs py-1" style={{ width: dayWidth }}>
                <div className="font-medium">{format(day, "EEE", { locale: ptBR })}</div>
                <div className="text-muted-foreground">{format(day, "d")}</div>
              </div>
            ))}
          </div>
          <div className="relative">
            {tasks.map(task => {
              const { left, width } = getTaskPosition(task);
              return (
                <div key={task.id} className="h-10 border-b relative">
                  <div className="absolute top-1 h-8 rounded cursor-pointer hover:opacity-80 flex items-center px-2 text-white text-xs truncate" style={{ left: Math.max(0, left), width: Math.max(20, width), backgroundColor: task.color || "#3b82f6" }} onClick={() => onTaskClick?.(task)}>
                    {task.name}
                    {task.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b" style={{ width: `${task.progress}%` }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default GanttChart;
