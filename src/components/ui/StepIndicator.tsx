import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps { steps: string[]; currentStep: number; className?: string; }

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors", i < currentStep ? "bg-primary border-primary text-primary-foreground" : i === currentStep ? "border-primary text-primary" : "border-muted text-muted-foreground")}>
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-xs mt-1 text-center max-w-[80px]", i === currentStep ? "text-primary font-medium" : "text-muted-foreground")}>{step}</span>
          </div>
          {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", i < currentStep ? "bg-primary" : "bg-muted")} />}
        </React.Fragment>
      ))}
    </div>
  );
}
export default StepIndicator;
