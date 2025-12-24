import { memo } from "react";
interface WizardStepProps { title: string; description?: string; children: React.ReactNode; }
export const WizardStep = memo(function WizardStep({ title, description, children }: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div><h3 className="font-medium text-lg">{title}</h3>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      <div>{children}</div>
    </div>
  );
});
