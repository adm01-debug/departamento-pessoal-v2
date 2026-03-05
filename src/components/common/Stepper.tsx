// Fix: common/Stepper.tsx - duplicate className attribute
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: Props) {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex items-center ${onStepClick ? 'cursor-pointer' : ''}`}
            onClick={() => onStepClick?.(index)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              index < currentStep
                ? 'bg-primary border-primary text-primary-foreground'
                : index === currentStep
                ? 'border-primary text-primary'
                : 'border-muted-foreground text-muted-foreground'
            }`}>
              {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </p>
              {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
