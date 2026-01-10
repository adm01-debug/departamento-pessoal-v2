import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface Step { label: string; status: "complete" | "current" | "pending"; }
interface StepperProps { steps: Step[]; className?: string; }

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2">
            {step.status === "complete" ? <CheckCircle className="h-6 w-6 text-primary" /> : step.status === "current" ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
            <span className={cn("text-sm", step.status === "pending" && "text-muted-foreground")}>{step.label}</span>
          </div>
          {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-border mx-4" />}
        </React.Fragment>
      ))}
    </div>
  );
}
export default Stepper;
