import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface WizardStep { title: string; content: React.ReactNode; validate?: () => boolean; }
interface WizardFormProps { steps: WizardStep[]; onComplete: () => void; className?: string; }

export function WizardForm({ steps, onComplete, className }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (steps[currentStep].validate && !steps[currentStep].validate()) return;
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  const back = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-4">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium", i < currentStep ? "bg-primary text-primary-foreground" : i === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={cn("flex-1 h-1 rounded", i < currentStep ? "bg-primary" : "bg-muted")} />}
            </React.Fragment>
          ))}
        </div>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <CardContent>{steps[currentStep].content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={currentStep === 0}>Voltar</Button>
        <Button onClick={next}>{currentStep === steps.length - 1 ? "Concluir" : "Próximo"}</Button>
      </CardFooter>
    </Card>
  );
}
export default WizardForm;
