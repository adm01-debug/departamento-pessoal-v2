import { useState, useCallback } from 'react';
export function useMultiStep(totalSteps: number) {
  const [step, setStep] = useState(1);
  const next = useCallback(() => setStep(s => Math.min(s + 1, totalSteps)), [totalSteps]);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);
  const goTo = useCallback((s: number) => setStep(Math.max(1, Math.min(s, totalSteps))), [totalSteps]);
  const reset = useCallback(() => setStep(1), []);
  return { step, next, prev, goTo, reset, isFirst: step === 1, isLast: step === totalSteps, progress: (step / totalSteps) * 100 };
}
