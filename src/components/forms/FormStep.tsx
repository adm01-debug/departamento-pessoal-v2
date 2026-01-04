import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, LucideIcon } from "lucide-react";

interface Step { id: string; title: string; description?: string; icon?: LucideIcon; }
interface FormStepProps { steps: Step[]; currentStep: number; onStepClick?: (index: number) => void; orientation?: "horizontal" | "vertical"; className?: string; }

export function FormStep({ steps, currentStep, onStepClick, orientation = "horizontal", className }: FormStepProps) {
  return (
    <div className={cn("flex", orientation === "vertical" ? "flex-col space-y-4" : "items-center justify-between", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className={cn("flex items-center gap-3", isClickable && "cursor-pointer")} onClick={() => isClickable && onStepClick(index)}>
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors", isCompleted ? "bg-primary border-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground")}>
                {isCompleted ? <Check className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : <span className="text-sm font-medium">{index + 1}</span>}
              </div>
              <div className={cn(orientation === "horizontal" && "hidden md:block")}>
                <p className={cn("text-sm font-medium", isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>
                {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
              </div>
            </div>
            {index < steps.length - 1 && <div className={cn("flex-1", orientation === "vertical" ? "w-0.5 h-8 ml-5 bg-muted" : "h-0.5 mx-4 bg-muted", isCompleted && "bg-primary")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export default FormStep;
