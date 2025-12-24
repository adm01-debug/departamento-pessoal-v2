import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
interface WizardActionsProps { onBack?: () => void; onNext?: () => void; onFinish?: () => void; isFirst?: boolean; isLast?: boolean; canProceed?: boolean; }
export const WizardActions = memo(function WizardActions({ onBack, onNext, onFinish, isFirst, isLast, canProceed = true }: WizardActionsProps) {
  return (
    <div className="flex justify-between pt-4 border-t">
      <Button variant="outline" onClick={onBack} disabled={isFirst}><ChevronLeft className="h-4 w-4 mr-2" />Voltar</Button>
      {isLast ? <Button onClick={onFinish} disabled={!canProceed}><Check className="h-4 w-4 mr-2" />Concluir</Button> : <Button onClick={onNext} disabled={!canProceed}>Próximo<ChevronRight className="h-4 w-4 ml-2" /></Button>}
    </div>
  );
});
