import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, CheckCircle, XCircle } from "lucide-react";

interface ProbationAlertProps { employeeName: string; startDate: string; endDate: string; daysRemaining: number; onApprove?: () => void; onExtend?: () => void; onTerminate?: () => void; className?: string; }

export function ProbationAlert({ employeeName, startDate, endDate, daysRemaining, onApprove, onExtend, onTerminate, className }: ProbationAlertProps) {
  const isUrgent = daysRemaining <= 15;

  return (
    <Card className={cn(isUrgent && "border-yellow-300 bg-yellow-50", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-medium">{employeeName}</p>
              <Badge variant="secondary">Período de Experiência</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{startDate} - {endDate}</p>
            <p className={cn("text-sm font-medium", isUrgent ? "text-yellow-600" : "text-muted-foreground")}><Clock className="h-3 w-3 inline mr-1" />{daysRemaining} dias restantes</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {onTerminate && <Button variant="outline" size="sm" onClick={onTerminate}><XCircle className="h-4 w-4 mr-1" />Desligar</Button>}
          {onExtend && <Button variant="outline" size="sm" onClick={onExtend}>Prorrogar</Button>}
          {onApprove && <Button size="sm" onClick={onApprove}><CheckCircle className="h-4 w-4 mr-1" />Efetivar</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default ProbationAlert;
