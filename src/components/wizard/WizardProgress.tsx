import { memo } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";
interface WizardProgressProps { steps: string[]; currentStep: number; }
export const WizardProgress = memo(function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            {i < currentStep ? <CheckCircle className="h-6 w-6 text-primary" /> : <Circle className={cn("h-6 w-6", i === currentStep ? "text-primary" : "text-muted-foreground")} />}
            <span className="text-xs mt-1">{step}</span>
          </div>
          {i < steps.length - 1 && <div className={cn("h-0.5 w-16 mx-2", i < currentStep ? "bg-primary" : "bg-muted")} />}
        </div>
      ))}
    </div>
  );
});
