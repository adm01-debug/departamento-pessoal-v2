import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";

interface WizardProps {
  className?: string;
  onComplete?: (data: Record<string, any>) => void;
  onCancel?: () => void;
}

const steps = ["Dados Pessoais", "Informacoes", "Documentacao", "Revisao"];

export function AumentoWizard({ className, onComplete, onCancel }: WizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  const handleNext = async () => {
    if (isLast) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 500));
      onComplete?.(data);
      setLoading(false);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => isFirst ? onCancel?.() : setStep(s => s - 1);

  return (
    <Card className={className || "w-full max-w-2xl mx-auto"}>
      <CardHeader>
        <CardTitle>AumentoWizard</CardTitle>
        <Progress value={progress} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="min-h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">Etapa {step + 1}: {steps[step]}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={loading}>
          <ChevronLeft className="h-4 w-4 mr-2" />{isFirst ? "Cancelar" : "Voltar"}
        </Button>
        <Button onClick={handleNext} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : isLast ? <Check className="h-4 w-4 mr-2" /> : null}
          {isLast ? "Concluir" : "Proximo"}<ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AumentoWizard;
