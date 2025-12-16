import { Plus, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAdmissoes } from '@/data/mockData';
import { cn } from '@/lib/utils';

const etapas = [
  'Solicitação Recebida',
  'Coleta de Documentos',
  'Validação',
  'Exame Admissional',
  'Contrato',
  'Assinatura',
  'eSocial',
  'Onboarding',
  'Concluído'
];

const etapaColors: Record<string, string> = {
  'Solicitação Recebida': 'bg-info/20 border-info',
  'Coleta de Documentos': 'bg-warning/20 border-warning',
  'Validação': 'bg-primary/20 border-primary',
  'Exame Admissional': 'bg-success/20 border-success',
};

export default function Admissao() {
  // Agrupar por etapa
  const admissoesPorEtapa = etapas.slice(0, 5).map(etapa => ({
    etapa,
    admissoes: mockAdmissoes.filter(a => a.etapa === etapa)
  }));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admissão</h1>
          <p className="text-muted-foreground text-sm">Processos admissionais em andamento</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Admissão
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">🗂️ Kanban</Button>
        <Button variant="ghost" size="sm">📋 Lista</Button>
        <Button variant="ghost" size="sm">📅 Calendário</Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {admissoesPorEtapa.map(({ etapa, admissoes }) => (
          <div key={etapa} className="flex-shrink-0 w-72">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{etapa}</h3>
                <Badge variant="secondary" className="text-xs">{admissoes.length}</Badge>
              </div>
            </div>

            {/* Column Content */}
            <div className={cn(
              "min-h-[400px] p-2 rounded-xl border-2 border-dashed space-y-3",
              etapaColors[etapa] || 'bg-muted/20 border-border'
            )}>
              {admissoes.map((adm) => (
                <div 
                  key={adm.id}
                  className="p-4 rounded-lg bg-card border border-border shadow-sm hover-lift cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {adm.candidatoNome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {adm.progresso}%
                    </Badge>
                  </div>
                  
                  <h4 className="font-medium text-sm text-foreground mb-1">{adm.candidatoNome}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{adm.cargo}</p>
                  <p className="text-xs text-muted-foreground">{adm.departamento}</p>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${adm.progresso}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Prev: {new Date(adm.dataPrevisao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}

              {admissoes.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">Nenhuma admissão</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
