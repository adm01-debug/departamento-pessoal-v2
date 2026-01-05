import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
interface WizardStep { title: string; component: React.ReactNode; isValid?: boolean; }
interface WizardProps { steps: WizardStep[]; onComplete: () => void; onCancel?: () => void; title?: string; }
export function Wizard({ steps, onComplete, onCancel, title }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const canProceed = steps[currentStep].isValid !== false;
  return (<Card className="max-w-2xl mx-auto"><CardHeader><CardTitle>{title || "Assistente"}</CardTitle><div className="flex items-center gap-2 mt-4">{steps.map((s, i) => <div key={i} className="flex items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i < currentStep ? "bg-green-500 text-white" : i === currentStep ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i < currentStep ? <Check className="h-4 w-4" /> : i + 1}</div>{i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? "bg-green-500" : "bg-muted"}`} />}</div>)}</div><Progress value={progress} className="mt-2" /></CardHeader><CardContent className="min-h-[300px]"><h3 className="font-medium mb-4">{steps[currentStep].title}</h3>{steps[currentStep].component}</CardContent><CardFooter className="flex justify-between">{onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}<div className="flex gap-2 ml-auto"><Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={isFirst}><ChevronLeft className="h-4 w-4 mr-1" />Anterior</Button>{isLast ? <Button onClick={onComplete} disabled={!canProceed}><Check className="h-4 w-4 mr-1" />Concluir</Button> : <Button onClick={() => setCurrentStep(s => s + 1)} disabled={!canProceed}>Próximo<ChevronRight className="h-4 w-4 ml-1" /></Button>}</div></CardFooter></Card>);
}
export default Wizard;
