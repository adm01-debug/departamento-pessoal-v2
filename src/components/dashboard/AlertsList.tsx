/**
 * @fileoverview Lista de alertas do dashboard com indicadores visuais de urgência
 * @module components/dashboard/AlertsList
 * @version V8.2 - Compatível com tipos do Dashboard
 */
import { memo } from 'react';
import { AlertTriangle, Calendar, Clock, FileText, Heart, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Interface de alerta compatível com o Dashboard
 */
interface Alerta {
  id: string;
  tipo: 'warning' | 'error' | 'info' | 'ferias' | 'admissao' | 'ponto' | 'atestado' | 'documento';
  titulo: string;
  descricao: string;
  data?: string;
  urgencia?: 'alta' | 'media' | 'baixa';
}

/** Mapeamento de tipos de alerta para ícones */
const alertIcons: Record<string, typeof AlertTriangle> = {
  warning: AlertCircle,
  error: AlertTriangle,
  info: Info,
  ferias: Calendar,
  admissao: FileText,
  ponto: Clock,
  atestado: Heart,
  documento: FileText,
};

/** 
 * Determinar urgência baseado no tipo
 */
const getUrgency = (alerta: Alerta): 'alta' | 'media' | 'baixa' => {
  if (alerta.urgencia) return alerta.urgencia;
  if (alerta.tipo === 'error') return 'alta';
  if (alerta.tipo === 'warning') return 'media';
  return 'baixa';
};

/** Cores de urgência para feedback visual */
const urgencyColors: Record<string, string> = {
  alta: 'border-l-destructive bg-destructive/5',
  media: 'border-l-warning bg-warning/5',
  baixa: 'border-l-info bg-info/5',
};

const urgencyTextColors: Record<string, string> = {
  alta: 'text-destructive',
  media: 'text-warning',
  baixa: 'text-info',
};

interface AlertsListProps {
  /** Lista de alertas a serem exibidos */
  alertas: Alerta[];
}

/**
 * Componente que exibe lista de alertas com cores de urgência
 * @param props - Propriedades do componente
 * @returns Lista de alertas formatada
 */
export const AlertsList = memo(function AlertsList({ alertas }: AlertsListProps) {
  if (!alertas || alertas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhum alerta no momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Lista de alertas">
      {alertas.map((alerta) => {
        const Icon = alertIcons[alerta.tipo] || AlertTriangle;
        const urgency = getUrgency(alerta);
        
        return (
          <div
            key={alerta.id}
            role="listitem"
            className={cn(
              "p-3 rounded-lg border-l-4 cursor-pointer hover:scale-[1.01] transition-transform",
              urgencyColors[urgency]
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                urgencyTextColors[urgency]
              )} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alerta.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alerta.descricao}</p>
                {alerta.data && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(alerta.data).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export type { Alerta };
