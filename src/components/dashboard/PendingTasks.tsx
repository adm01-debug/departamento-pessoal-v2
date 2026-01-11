// V15-266: src/components/dashboard/PendingTasks.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, FileText, Clock, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  type: 'ferias' | 'documento' | 'folha' | 'ponto';
  title: string;
  description: string;
  urgent?: boolean;
}

interface PendingTasksProps {
  tasks: Task[];
}

const iconMap = { ferias: Calendar, documento: FileText, folha: FileText, ponto: Clock };

export function PendingTasks({ tasks }: PendingTasksProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />Pendências</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.map((t) => {
            const Icon = iconMap[t.type] || AlertCircle;
            return (
              <div key={t.id} className={"flex items-center gap-3 p-3 rounded-lg border " + (t.urgent ? 'border-red-200 bg-red-50' : '')}>
                <Icon className={"h-5 w-5 " + (t.urgent ? 'text-red-600' : 'text-muted-foreground')} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
