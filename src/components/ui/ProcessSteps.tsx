import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step { label: string; description?: string; }
interface ProcessStepsProps { steps: Step[]; currentStep: number; className?: string; }

export function ProcessSteps({ steps, currentStep, className }: ProcessStepsProps) {
  return (
    <div className={cn("flex", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex-1 relative">
            <div className="flex items-center">
              <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm border-2 z-10 bg-background", isCompleted ? "border-primary bg-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-muted text-muted-foreground")}>
                {isCompleted ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={cn("flex-1 h-0.5", isCompleted ? "bg-primary" : "bg-muted")} />}
            </div>
            <div className="mt-2">
              <p className={cn("text-sm font-medium", isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
              {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ProcessSteps;
