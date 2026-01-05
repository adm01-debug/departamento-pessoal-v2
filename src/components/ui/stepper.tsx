import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";
interface Step { id: string; title: string; description?: string; }
interface StepperProps { steps: Step[]; currentStep: number; onStepClick?: (index: number) => void; className?: string; }
export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("flex items-center", className)}>{steps.map((step, index) => { const isCompleted = index < currentStep; const isCurrent = index === currentStep; const isClickable = onStepClick && index <= currentStep; return (<React.Fragment key={step.id}>{index > 0 && <div className={cn("flex-1 h-0.5 mx-2", isCompleted ? "bg-primary" : "bg-muted")} />}<div className={cn("flex items-center gap-2", isClickable && "cursor-pointer")} onClick={() => isClickable && onStepClick(index)}><div className={cn("flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium", isCompleted ? "bg-primary border-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-muted text-muted-foreground")}>{isCompleted ? <Check className="w-4 h-4" /> : index + 1}</div><div className="hidden sm:block"><p className={cn("text-sm font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>{step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}</div></div></React.Fragment>); })}</div>
  );
}
export default Stepper;
