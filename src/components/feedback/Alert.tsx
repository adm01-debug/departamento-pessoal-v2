/**
 * @fileoverview Componente de alerta
 * @module components/feedback/Alert
 */
import { memo } from 'react';
import { Alert as AlertUI, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AlertProps { tipo: 'info' | 'sucesso' | 'aviso' | 'erro'; titulo?: string; mensagem: string; }

const config = {
  info: { icon: Info, variant: 'default' as const },
  sucesso: { icon: CheckCircle, variant: 'default' as const },
  aviso: { icon: AlertTriangle, variant: 'default' as const },
  erro: { icon: XCircle, variant: 'destructive' as const },
};

export const Alert = memo(function Alert({ tipo, titulo, mensagem }: AlertProps) {
  const { icon: Icon, variant } = config[tipo];
  return (
    <AlertUI variant={variant}>
      <Icon className="h-4 w-4" />
      {titulo && <AlertTitle>{titulo}</AlertTitle>}
      <AlertDescription>{mensagem}</AlertDescription>
    </AlertUI>
  );
});
