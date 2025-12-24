/**
 * @fileoverview Etapa do onboarding
 * @module components/onboarding/OnboardingStep
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface OnboardingStepProps {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  children: React.ReactNode;
  completo?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const OnboardingStep = memo(function OnboardingStep({
  titulo, descricao, icone, children, completo, onComplete, onSkip
}: OnboardingStepProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">{icone}</div>
        <CardTitle className="flex items-center justify-center gap-2">
          {titulo}
          {completo && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <div className="flex justify-between pt-4">
          {onSkip && <Button variant="ghost" onClick={onSkip}>Pular</Button>}
          {onComplete && <Button onClick={onComplete} className="ml-auto">Continuar</Button>}
        </div>
      </CardContent>
    </Card>
  );
});
