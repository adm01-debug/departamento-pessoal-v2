import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, AlertCircle, LucideIcon } from "lucide-react";

interface Step { id: string; title: string; description?: string; icon?: LucideIcon; }
interface FormStepProps { steps: Step[]; currentStep: number; onStepClick?: (index: number) => void; orientation?: "horizontal" | "vertical"; showNumbers?: boolean; className?: string; completedSteps?: number[]; errorSteps?: number[]; }

export function FormStep({ steps, currentStep, onStepClick, orientation = "horizontal", showNumbers = true, className, completedSteps = [], errorSteps = [] }: FormStepProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={cn(isHorizontal ? "flex items-center justify-between" : "flex flex-col space-y-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isError = errorSteps.includes(index);
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || index <= currentStep);
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div className={cn("flex items-center", isHorizontal ? "flex-col" : "gap-3", isClickable && "cursor-pointer")} onClick={() => isClickable && onStepClick(index)}>
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors", isCompleted && "bg-green-500 border-green-500 text-white", isError && "bg-destructive border-destructive text-white", isCurrent && !isCompleted && !isError && "bg-primary border-primary text-primary-foreground", !isCurrent && !isCompleted && !isError && "border-muted-foreground/30 text-muted-foreground")}>
                {isCompleted ? <Check className="h-5 w-5" /> : isError ? <AlertCircle className="h-5 w-5" /> : Icon ? <Icon className="h-5 w-5" /> : showNumbers ? index + 1 : <Circle className="h-3 w-3 fill-current" />}
              </div>
              <div className={cn("text-center", isHorizontal ? "mt-2" : "")}>
                <p className={cn("text-sm font-medium", isCurrent && "text-primary", !isCurrent && "text-muted-foreground")}>{step.title}</p>
                {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
              </div>
            </div>
            {index < steps.length - 1 && isHorizontal && <div className={cn("flex-1 h-0.5 mx-4", isCompleted || index < currentStep ? "bg-primary" : "bg-muted")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export default FormStep;
