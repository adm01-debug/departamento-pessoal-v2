import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  isOptional?: boolean;
  validate?: () => boolean | Promise<boolean>;
}

interface StepWizardProps {
  steps: WizardStep[];
  className?: string;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
  allowSkip?: boolean;
  showStepIndicator?: boolean;
}

export function StepWizard({ steps, className, onComplete, onStepChange, allowSkip = false, showStepIndicator = true }: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
      onStepChange?.(index);
    }
  }, [steps.length, onStepChange]);

  const handleNext = async () => {
    if (currentStepData.validate) {
      setIsValidating(true);
      const isValid = await currentStepData.validate();
      setIsValidating(false);
      if (!isValid) return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (isLastStep) {
      onComplete?.();
    } else {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) goToStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStepData.isOptional && !isLastStep) {
      goToStep(currentStep + 1);
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      {showStepIndicator && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors", completedSteps.has(index) ? "bg-primary border-primary text-primary-foreground" : index === currentStep ? "border-primary text-primary" : "border-muted text-muted-foreground")} onClick={() => (completedSteps.has(index) || index < currentStep) && goToStep(index)} style={{ cursor: completedSteps.has(index) || index < currentStep ? "pointer" : "default" }}>
                    {completedSteps.has(index) ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className={cn("text-xs mt-1 text-center max-w-[80px] truncate", index === currentStep ? "text-primary font-medium" : "text-muted-foreground")}>{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", completedSteps.has(index) ? "bg-primary" : "bg-muted")} />}
              </React.Fragment>
            ))}
          </div>
          <CardTitle>{currentStepData.title}</CardTitle>
          {currentStepData.description && <p className="text-sm text-muted-foreground">{currentStepData.description}</p>}
        </CardHeader>
      )}
      <CardContent className="min-h-[200px]">{currentStepData.content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={isFirstStep || isValidating}>
          <ChevronLeft className="h-4 w-4 mr-1" />Voltar
        </Button>
        <div className="flex gap-2">
          {allowSkip && currentStepData.isOptional && !isLastStep && (
            <Button variant="ghost" onClick={handleSkip} disabled={isValidating}>Pular</Button>
          )}
          <Button onClick={handleNext} disabled={isValidating}>
            {isValidating && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {isLastStep ? "Concluir" : "Próximo"}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default StepWizard;
