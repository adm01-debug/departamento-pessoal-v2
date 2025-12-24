/**
 * @fileoverview Painel de tarefas pendentes
 * @module components/dashboard/TasksPanel
 */
import { memo } from 'react';
import { CheckSquare, Square, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  titulo: string;
  prazo?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  concluida: boolean;
}

interface TasksPanelProps {
  /** Lista de tarefas */
  tasks: Task[];
  /** Callback ao marcar tarefa como concluída */
  onToggle?: (id: string) => void;
}

const prioridadeColors = {
  alta: 'border-l-red-500',
  media: 'border-l-yellow-500',
  baixa: 'border-l-blue-500',
};

/**
 * Painel que exibe tarefas pendentes com prioridade visual
 */
export const TasksPanel = memo(function TasksPanel({ tasks, onToggle }: TasksPanelProps) {
  const pendentes = tasks.filter(t => !t.concluida);
  const concluidas = tasks.filter(t => t.concluida);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          Tarefas
          <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">
            {pendentes.length} pendentes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sem tarefas</p>
        ) : (
          <>
            {pendentes.map((task) => (
              <div 
                key={task.id}
                className={cn("p-3 rounded-lg border-l-4 bg-muted/50", prioridadeColors[task.prioridade])}
              >
                <div className="flex items-start gap-3">
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => onToggle?.(task.id)}>
                    <Square className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{task.titulo}</p>
                    {task.prazo && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.prazo}
                      </div>
                    )}
                  </div>
                  {task.prioridade === 'alta' && <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            ))}
            {concluidas.length > 0 && (
              <div className="pt-2 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground mb-2">{concluidas.length} concluídas</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

