/**
 * @fileoverview Progresso do onboarding
 * @module components/onboarding/OnboardingProgress
 */
import { memo } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step { id: string; titulo: string; completo: boolean; }
interface OnboardingProgressProps { steps: Step[]; currentStep: number; }

export const OnboardingProgress = memo(function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const completados = steps.filter(s => s.completo).length;
  const percentual = (completados / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progresso</span>
        <span className="font-medium">{completados}/{steps.length} etapas</span>
      </div>
      <Progress value={percentual} />
      <div className="flex justify-between">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-1">
            <div className={cn('rounded-full p-1', step.completo ? 'bg-green-100' : idx === currentStep ? 'bg-primary/10' : 'bg-muted')}>
              {step.completo ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Circle className={cn('h-4 w-4', idx === currentStep ? 'text-primary' : 'text-muted-foreground')} />}
            </div>
            <span className={cn('text-xs', idx === currentStep && 'font-medium')}>{step.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
