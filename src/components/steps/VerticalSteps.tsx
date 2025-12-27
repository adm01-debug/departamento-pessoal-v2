import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
interface VerticalStep { title: string; description?: string; content?: React.ReactNode; }
interface VerticalStepsProps { steps: VerticalStep[]; currentStep: number; className?: string; }
export function VerticalSteps({ steps, currentStep, className }: VerticalStepsProps) {
  return (<div className={cn('space-y-4', className)}>{steps.map((step, i) => (<div key={i} className="flex gap-4"><div className="flex flex-col items-center"><div className={cn('w-8 h-8 rounded-full flex items-center justify-center', i < currentStep ? 'bg-primary text-primary-foreground' : i === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{i < currentStep ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}</div>{i < steps.length - 1 && <div className={cn('w-0.5 flex-1 mt-2', i < currentStep ? 'bg-primary' : 'bg-muted')} />}</div><div className="flex-1 pb-8"><h4 className="font-medium">{step.title}</h4>{step.description && <p className="text-sm text-muted-foreground">{step.description}</p>}{step.content && i === currentStep && <div className="mt-4">{step.content}</div>}</div></div>))}</div>);
}
