import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, FileText } from "lucide-react";

interface ContractRenewalAlertProps { employeeName: string; contractType: string; endDate: string; daysRemaining: number; onRenew?: () => void; onView?: () => void; className?: string; }

export function ContractRenewalAlert({ employeeName, contractType, endDate, daysRemaining, onRenew, onView, className }: ContractRenewalAlertProps) {
  const isUrgent = daysRemaining <= 7;
  const isWarning = daysRemaining <= 30 && daysRemaining > 7;

  return (
    <Card className={cn(isUrgent ? "border-red-300 bg-red-50" : isWarning ? "border-yellow-300 bg-yellow-50" : "", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", isUrgent ? "bg-red-100" : "bg-yellow-100")}>
            <AlertTriangle className={cn("h-5 w-5", isUrgent ? "text-red-600" : "text-yellow-600")} />
          </div>
          <div className="flex-1">
            <p className="font-medium">{employeeName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />{contractType}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Vence em: {endDate}</p>
            <p className={cn("text-sm font-medium mt-1", isUrgent ? "text-red-600" : "text-yellow-600")}>{daysRemaining} dias restantes</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {onView && <Button variant="outline" size="sm" onClick={onView}>Ver Contrato</Button>}
          {onRenew && <Button size="sm" onClick={onRenew}>Renovar</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default ContractRenewalAlert;
