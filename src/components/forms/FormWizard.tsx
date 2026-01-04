import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";

interface WizardStep { id: string; title: string; description?: string; content: React.ReactNode; validate?: () => boolean | Promise<boolean>; }
interface FormWizardProps { steps: WizardStep[]; onComplete: (data: any) => void | Promise<void>; onCancel?: () => void; title?: string; description?: string; className?: string; }

export function FormWizard({ steps, onComplete, onCancel, title, description, className }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = async () => {
    if (step.validate) { setLoading(true); const valid = await step.validate(); setLoading(false); if (!valid) return; }
    if (isLast) { setLoading(true); await onComplete({}); setLoading(false); } else setCurrentStep(s => s + 1);
  };
  const handlePrev = () => { if (!isFirst) setCurrentStep(s => s - 1); };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        <div className="pt-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="font-medium">{step.title}</span><span className="text-muted-foreground">Passo {currentStep + 1} de {steps.length}</span></div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px]">{step.description && <p className="text-sm text-muted-foreground mb-4">{step.description}</p>}{step.content}</CardContent>
      <CardFooter className="flex justify-between">
        <div>{onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrev} disabled={isFirst || loading}><ChevronLeft className="h-4 w-4 mr-1" />Anterior</Button>
          <Button onClick={handleNext} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : isLast ? <Check className="h-4 w-4 mr-1" /> : null}{isLast ? "Concluir" : "Próximo"}{!isLast && <ChevronRight className="h-4 w-4 ml-1" />}</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
export default FormWizard;
