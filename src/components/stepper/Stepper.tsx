import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Step { label: string; description?: string; }
interface StepperProps { steps: Step[]; currentStep: number; className?: string; }
export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (<div className={cn('flex items-center', className)}>{steps.map((step, i) => (<div key={i} className="flex items-center"><div className={cn('flex items-center justify-center w-8 h-8 rounded-full border-2', i < currentStep ? 'bg-primary border-primary text-primary-foreground' : i === currentStep ? 'border-primary text-primary' : 'border-muted text-muted-foreground')}>{i < currentStep ? <Check className="h-4 w-4" /> : i + 1}</div><div className="ml-2 mr-4"><p className={cn('text-sm font-medium', i <= currentStep ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</p>{step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}</div>{i < steps.length - 1 && <div className={cn('flex-1 h-0.5 mx-4', i < currentStep ? 'bg-primary' : 'bg-muted')} />}</div>))}</div>);
}
