/**
 * @fileoverview Lista de atividades recentes do sistema
 * @module components/dashboard/RecentActivities
 */
import { memo } from 'react';
import { Activity, User, FileText, Calendar, Clock, DollarSign, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RecentActivity {
  id: string;
  tipo: 'usuario' | 'documento' | 'ferias' | 'ponto' | 'folha' | 'config';
  descricao: string;
  usuario: string;
  data: string;
}

interface RecentActivitiesProps {
  /** Lista de atividades recentes */
  activities: RecentActivity[];
  /** Número máximo de atividades a exibir */
  limit?: number;
}

const activityIcons = {
  usuario: User,
  documento: FileText,
  ferias: Calendar,
  ponto: Clock,
  folha: DollarSign,
  config: Settings,
};

const activityColors = {
  usuario: 'text-blue-500',
  documento: 'text-green-500',
  ferias: 'text-orange-500',
  ponto: 'text-purple-500',
  folha: 'text-emerald-500',
  config: 'text-gray-500',
};

/**
 * Componente que exibe atividades recentes do sistema
 */
export const RecentActivities = memo(function RecentActivities({ activities, limit = 10 }: RecentActivitiesProps) {
  const displayActivities = activities.slice(0, limit);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[350px] overflow-y-auto">
        {displayActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sem atividades recentes</p>
        ) : (
          displayActivities.map((activity) => {
            const Icon = activityIcons[activity.tipo] || Activity;
            return (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className={cn("p-2 rounded-lg bg-muted", activityColors[activity.tipo])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.descricao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.usuario}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{activity.data}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
});

