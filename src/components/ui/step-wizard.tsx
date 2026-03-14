import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

interface StepWizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel?: () => void;
  completeLabel?: string;
  className?: string;
}

export function StepWizard({ steps, onComplete, onCancel, completeLabel = 'Finalizar', className }: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goNext = async () => {
    const step = steps[currentStep];
    if (step.validate) {
      const valid = await step.validate();
      if (!valid) return;
    }
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (isLastStep) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index < currentStep || completedSteps.has(index) || completedSteps.has(index - 1)) {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = i === currentStep;
          const isAccessible = i < currentStep || isCompleted || completedSteps.has(i - 1);

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <button
                onClick={() => goToStep(i)}
                disabled={!isAccessible}
                className={cn(
                  'relative flex items-center justify-center h-9 w-9 rounded-full text-caption font-bold transition-all duration-300 shrink-0',
                  isCompleted
                    ? 'bg-gradient-to-br from-success to-finance text-primary-foreground shadow-glow-success'
                    : isCurrent
                    ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow ring-4 ring-primary/20'
                    : isAccessible
                    ? 'bg-accent text-foreground hover:bg-accent/80 cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </button>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-finance rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step header */}
      <div>
        <p className="text-overline text-muted-foreground mb-1">
          PASSO {currentStep + 1} DE {steps.length}
        </p>
        <h2 className="text-h1 font-display font-bold">{steps[currentStep].title}</h2>
        {steps[currentStep].description && (
          <p className="text-body text-muted-foreground font-body mt-1">{steps[currentStep].description}</p>
        )}
      </div>

      {/* Step content with animation */}
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <CardContent className="p-card-space">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <div>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="font-body">
              Cancelar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={isFirstStep}
            className="gap-2 font-body rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            onClick={goNext}
            className={cn(
              'gap-2 font-body rounded-xl',
              isLastStep
                ? 'bg-gradient-to-r from-success to-finance hover:opacity-90'
                : 'bg-gradient-to-r from-primary to-primary-glow hover:opacity-90'
            )}
          >
            {isLastStep ? completeLabel : 'Próximo'}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
