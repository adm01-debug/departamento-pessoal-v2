import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OnboardingStepProps { image?: string; title: string; description: string; onNext: () => void; onSkip?: () => void; isLast?: boolean; className?: string; }

export function OnboardingStep({ image, title, description, onNext, onSkip, isLast, className }: OnboardingStepProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      {image && <img src={image} alt="" className="h-48 mb-8" />}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-8">{description}</p>
      <div className="flex gap-4">
        {onSkip && !isLast && <Button variant="ghost" onClick={onSkip}>Pular</Button>}
        <Button onClick={onNext}>{isLast ? "Finalizar" : "Próximo"}</Button>
      </div>
    </div>
  );
}
export default OnboardingStep;
