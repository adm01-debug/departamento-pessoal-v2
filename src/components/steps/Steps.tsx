import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
interface Step { title: string; description?: string; }
interface StepsProps { steps: Step[]; currentStep: number; className?: string; }
export function Steps({ steps, currentStep, className }: StepsProps) {
  return (<div className={cn('flex items-center', className)}>{steps.map((step, i) => (<div key={i} className="flex items-center"><div className="flex flex-col items-center"><div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', i < currentStep ? 'bg-primary text-primary-foreground' : i === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground')}>{i < currentStep ? <Check className="w-4 h-4" /> : i + 1}</div><span className="text-xs mt-1 text-center max-w-20">{step.title}</span></div>{i < steps.length - 1 && <div className={cn('h-0.5 w-16 mx-2', i < currentStep ? 'bg-primary' : 'bg-muted')} />}</div>))}</div>);
}
