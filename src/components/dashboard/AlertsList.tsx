import { memo } from 'react';
import { memo } from 'react';
import { AlertTriangle, Calendar, Clock, FileText, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alerta } from '@/data/mockData';

const alertIcons: Record<string, typeof AlertTriangle> = {
  ferias: Calendar,
  admissao: FileText,
  ponto: Clock,
  atestado: Heart,
  documento: FileText,
};

const urgencyColors: Record<string, string> = {
  alta: 'border-l-destructive bg-destructive/5',
  media: 'border-l-warning bg-warning/5',
  baixa: 'border-l-info bg-info/5',
};

interface AlertsListProps {
  alertas: Alerta[];
}

export function AlertsList({ alertas }: AlertsListProps) {
  return (
    <div className="space-y-2">
      {alertas.map((alerta) => {
        const Icon = alertIcons[alerta.tipo] || AlertTriangle;
        return (
          <div
            key={alerta.id}
            className={cn(
              "p-3 rounded-lg border-l-4 cursor-pointer hover:scale-[1.01] transition-transform",
              urgencyColors[alerta.urgencia]
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                alerta.urgencia === 'alta' ? 'text-destructive' : 
                alerta.urgencia === 'media' ? 'text-warning' : 'text-info'
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alerta.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alerta.descricao}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}




