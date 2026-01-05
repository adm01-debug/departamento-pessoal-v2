import { useState, useCallback } from "react";
interface UseFormStepReturn { currentStep: number; totalSteps: number; isFirstStep: boolean; isLastStep: boolean; nextStep: () => void; prevStep: () => void; goToStep: (step: number) => void; reset: () => void; progress: number; }
export function useFormSteps(totalSteps: number): UseFormStepReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const nextStep = useCallback(() => { if (!isLastStep) setCurrentStep(s => s + 1); }, [isLastStep]);
  const prevStep = useCallback(() => { if (!isFirstStep) setCurrentStep(s => s - 1); }, [isFirstStep]);
  const goToStep = useCallback((step: number) => { if (step >= 0 && step < totalSteps) setCurrentStep(step); }, [totalSteps]);
  const reset = useCallback(() => setCurrentStep(0), []);
  return { currentStep, totalSteps, isFirstStep, isLastStep, nextStep, prevStep, goToStep, reset, progress };
}
export default useFormSteps;
