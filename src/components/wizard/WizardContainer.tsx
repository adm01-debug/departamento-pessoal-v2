import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface WizardContainerProps { title: string; children: React.ReactNode; }
export const WizardContainer = memo(function WizardContainer({ title, children }: WizardContainerProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
});
