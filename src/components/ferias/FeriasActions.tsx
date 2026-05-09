import { Button } from '@/components/ui/button';
import { UserCheck, Shield, Building2, X, Ban, FileDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { feriasPDF } from '@/utils/feriasPDF';

interface FeriasActionsProps {
  solicitacao: Record<string, any>;
  onAprovarGestor: (id: string) => void;
  onAprovarRH: (id: string) => void;
  onEnviarContabilidade: (id: string) => void;
  onRejeitar: (id: string) => void;
  onCancelar: (id: string) => void;
}

const actionConfig = [
  { condition: (s: any) => !s.aprovado_gestor, icon: UserCheck, label: 'Aprovar (Gestor)', action: 'aprovarGestor', color: 'hover:bg-success/10 text-success' },
  { condition: (s: any) => s.aprovado_gestor && !s.aprovado_rh, icon: Shield, label: 'Aprovar (RH)', action: 'aprovarRH', color: 'hover:bg-success/10 text-success' },
  { condition: (s: any) => s.aprovado_rh && !s.enviado_contabilidade, icon: Building2, label: 'Enviar Contabilidade', action: 'enviarContabilidade', color: 'hover:bg-info/10 text-info' },
  { condition: (s: any) => !s.aprovado_gestor, icon: X, label: 'Rejeitar', action: 'rejeitar', color: 'hover:bg-destructive/10 text-destructive' },
] as const;

const actionHandlers: Record<string, keyof Omit<FeriasActionsProps, 'solicitacao'>> = {
  aprovarGestor: 'onAprovarGestor',
  aprovarRH: 'onAprovarRH',
  enviarContabilidade: 'onEnviarContabilidade',
  rejeitar: 'onRejeitar',
};

export function FeriasActions(props: FeriasActionsProps) {
  const { solicitacao } = props;

  if (solicitacao.cancelado || solicitacao.status === 'rejeitada') return null;

  return (
    <TooltipProvider>
      <div className="flex gap-0.5">
        {actionConfig.map(({ condition, icon: Icon, label, action, color }) => {
          if (!condition(solicitacao)) return null;
          const handler = props[actionHandlers[action]];
          return (
            <Tooltip key={action}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-lg ${color}`}
                  onClick={() => handler(solicitacao.id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p className="text-xs">{label}</p></TooltipContent>
            </Tooltip>
          );
        })}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-primary/10 text-primary"
              onClick={() => feriasPDF.gerarRecibo(solicitacao)}
            >
              <FileDown className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-xs">Baixar Recibo</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-destructive/10 text-destructive"
              onClick={() => props.onCancelar(solicitacao.id)}
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p className="text-xs">Cancelar</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
