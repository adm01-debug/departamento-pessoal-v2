import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { FormStep } from "./FormStep";

interface WizardStep { id: string; title: string; description?: string; content: React.ReactNode; validate?: () => boolean | Promise<boolean>; }
interface FormWizardProps { steps: WizardStep[]; onComplete: (data: any) => void | Promise<void>; onCancel?: () => void; title?: string; className?: string; showProgress?: boolean; allowSkip?: boolean; }

export function FormWizard({ steps, onComplete, onCancel, title, className, showProgress = true, allowSkip = false }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = async () => {
    const step = steps[currentStep];
    if (step.validate) {
      setLoading(true);
      const isValid = await step.validate();
      setLoading(false);
      if (!isValid) return;
    }
    setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
    if (isLast) { setLoading(true); await onComplete({}); setLoading(false); }
    else setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => { if (!isFirst) setCurrentStep(prev => prev - 1); };
  const handleStepClick = (index: number) => { if (completedSteps.includes(index) || index <= currentStep) setCurrentStep(index); };

  return (
    <Card className={cn("", className)}>
      {title && <CardHeader><CardTitle>{title}</CardTitle></CardHeader>}
      <CardContent className="space-y-6">
        <FormStep steps={steps.map((s, i) => ({ id: s.id, title: s.title, description: s.description }))} currentStep={currentStep} onStepClick={handleStepClick} completedSteps={completedSteps} />
        {showProgress && <Progress value={progress} className="h-2" />}
        <div className="min-h-[200px]">{steps[currentStep].content}</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>{onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}</div>
        <div className="flex gap-2">
          {!isFirst && <Button variant="outline" onClick={handlePrev} disabled={loading}><ChevronLeft className="h-4 w-4 mr-1" />Anterior</Button>}
          {allowSkip && !isLast && <Button variant="ghost" onClick={() => setCurrentStep(prev => prev + 1)}>Pular</Button>}
          <Button onClick={handleNext} disabled={loading}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{isLast ? <><Check className="h-4 w-4 mr-1" />Concluir</> : <>Próximo<ChevronRight className="h-4 w-4 ml-1" /></>}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default FormWizard;
