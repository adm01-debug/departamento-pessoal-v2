/**
 * @fileoverview Status de assinatura com timeline
 * @module components/assinatura/AssinaturaStatus
 */
import { memo } from 'react';
import { CheckCircle, Clock, XCircle, Send, Eye } from 'lucide-react';

interface StatusStep {
  status: 'completed' | 'current' | 'pending' | 'error';
  label: string;
  date?: string;
}

interface AssinaturaStatusProps {
  steps?: StatusStep[];
  className?: string;
}

const defaultSteps: StatusStep[] = [
  { status: 'completed', label: 'Documento enviado', date: '' },
  { status: 'completed', label: 'Visualizado', date: '' },
  { status: 'current', label: 'Aguardando assinatura' },
  { status: 'pending', label: 'Concluído' },
];

const stepIcons = {
  completed: CheckCircle,
  current: Clock,
  pending: Clock,
  error: XCircle,
};

const stepColors = {
  completed: 'text-green-500 bg-green-100',
  current: 'text-blue-500 bg-blue-100 animate-pulse',
  pending: 'text-gray-400 bg-gray-100',
  error: 'text-red-500 bg-red-100',
};

/**
 * Timeline de status da assinatura
 */
export const AssinaturaStatus = memo(function AssinaturaStatus({
  steps = defaultSteps,
  className = ''
}: AssinaturaStatusProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {steps.map((step, index) => {
        const Icon = stepIcons[step.status];
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`rounded-full p-2 ${stepColors[step.status]}`}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className={`w-0.5 h-full min-h-[20px] ${step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`} />}
            </div>
            <div className="flex-1 pb-4">
              <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-muted-foreground' : ''}`}>{step.label}</p>
              {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
});
