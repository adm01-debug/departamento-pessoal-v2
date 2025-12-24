/**
 * @fileoverview Wizard de onboarding
 * @module components/onboarding/OnboardingWizard
 */
import { memo, useState } from 'react';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingStep } from './OnboardingStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step { id: string; titulo: string; descricao: string; icone: React.ReactNode; content: React.ReactNode; }
interface OnboardingWizardProps { steps: Step[]; onComplete: () => void; onSkip?: () => void; }

export const OnboardingWizard = memo(function OnboardingWizard({ steps, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, steps[currentStep].id]);
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else onComplete();
  };

  const handleBack = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const progressSteps = steps.map(s => ({ id: s.id, titulo: s.titulo, completo: completedSteps.includes(s.id) }));
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="space-y-8 p-6">
      <OnboardingProgress steps={progressSteps} currentStep={currentStep} />
      <OnboardingStep titulo={step.titulo} descricao={step.descricao} icone={step.icone} completo={completedSteps.includes(step.id)}>
        {step.content}
      </OnboardingStep>
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Button>
        <div className="flex gap-2">
          {onSkip && <Button variant="ghost" onClick={onSkip}>Pular tudo</Button>}
          <Button onClick={handleNext}>{isLast ? <><Check className="h-4 w-4 mr-1" />Concluir</> : <>Próximo<ChevronRight className="h-4 w-4 ml-1" /></>}</Button>
        </div>
      </div>
    </div>
  );
});
