import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FeriasWizardProps { onComplete?: (data: any) => void; onCancel?: () => void; }

export const FeriasWizard: React.FC<FeriasWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Férias - Passo {step} de {totalSteps}</CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px] flex items-center justify-center">
          <p>Conteúdo do passo {step}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : onCancel?.()}>
          {step > 1 ? 'Voltar' : 'Cancelar'}
        </Button>
        <Button onClick={() => step < totalSteps ? setStep(step + 1) : onComplete?.({})}>
          {step < totalSteps ? 'Próximo' : 'Concluir'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeriasWizard;
