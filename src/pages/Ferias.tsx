import { Plus, Calendar, List, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockFerias } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  aprovada: 'Aprovada',
  pendente: 'Pendente',
  em_gozo: 'Em Gozo',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  aprovada: { bg: 'bg-success/10', text: 'text-success' },
  pendente: { bg: 'bg-warning/10', text: 'text-warning' },
  em_gozo: { bg: 'bg-info/10', text: 'text-info' },
};

export default function Ferias() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Férias</h1>
          <p className="text-muted-foreground text-sm">Gestão de férias e períodos aquisitivos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Solicitação
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Calendário
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <List className="w-4 h-4" />
          Lista
        </Button>
      </div>

      {/* Alert: Períodos críticos */}
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm text-foreground">Períodos Aquisitivos Críticos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              3 colaboradores com férias vencendo nos próximos 30 dias
            </p>
            <div className="flex gap-2 mt-3">
              <Badge className="bg-destructive/10 text-destructive border-0">Ana Souza - 15 dias</Badge>
              <Badge className="bg-warning/10 text-warning border-0">Carlos Lima - 28 dias</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Férias List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm text-foreground">Férias Programadas</h3>
        </div>
        <div className="divide-y divide-border">
          {mockFerias.map((ferias) => {
            const colors = statusColors[ferias.status];
            return (
              <div key={ferias.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <span className="text-sm">🏖️</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{ferias.colaboradorNome}</p>
                      <p className="text-xs text-muted-foreground">{ferias.departamento}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(ferias.dataInicio).toLocaleDateString('pt-BR')} - {new Date(ferias.dataFim).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">{ferias.dias} dias</p>
                    </div>
                    
                    <Badge className={cn("border-0", colors.bg, colors.text)}>
                      {statusLabels[ferias.status]}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
