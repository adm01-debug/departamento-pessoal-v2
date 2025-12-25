import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
interface Step { label: string; description?: string; }
interface Props { steps: Step[]; currentStep: number; className?: string; }
export const Stepper = memo(function Stepper({ steps, currentStep, className }: Props) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={cn('flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium', i < currentStep ? 'bg-primary text-white' : i === currentStep ? 'bg-primary/20 text-primary border-2 border-primary' : 'bg-gray-200 text-gray-500')}>
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <div className="ml-2 mr-4"><p className="text-sm font-medium">{step.label}</p>{step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}</div>
          {i < steps.length - 1 && <div className={cn('flex-1 h-0.5 w-8', i < currentStep ? 'bg-primary' : 'bg-gray-200')} />}
        </div>
      ))}
    </div>
  );
});
