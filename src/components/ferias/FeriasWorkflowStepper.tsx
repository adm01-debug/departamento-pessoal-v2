import { UserCheck, Shield, Building2, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const steps = [
  { key: 'aprovado_gestor', label: 'Gestor', icon: UserCheck },
  { key: 'aprovado_rh', label: 'RH', icon: Shield },
  { key: 'enviado_contabilidade', label: 'Contabilidade', icon: Building2 },
] as const;

export function FeriasWorkflowStepper({ solicitacao }: { solicitacao: Record<string, any> }) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {steps.map(({ key, label, icon: Icon }, i) => {
          const done = !!solicitacao[key];
          const dateKey = `${key}_em`;
          return (
            <div key={key} className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'relative p-1.5 rounded-lg transition-colors',
                      done ? 'bg-success/15 text-success' : 'bg-muted/40 text-muted-foreground'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {done && (
                      <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success flex items-center justify-center">
                        <Check className="h-1.5 w-1.5 text-success-foreground" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-medium">{label}: {done ? '✅ Aprovado' : '⏳ Pendente'}</p>
                  {solicitacao[dateKey] && (
                    <p className="text-muted-foreground">{format(new Date(solicitacao[dateKey]), 'dd/MM/yyyy HH:mm')}</p>
                  )}
                </TooltipContent>
              </Tooltip>
              {i < steps.length - 1 && (
                <div className={cn('w-3 h-px', done ? 'bg-success/50' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
