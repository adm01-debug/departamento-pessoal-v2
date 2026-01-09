import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, Calendar, Upload } from "lucide-react";

interface ExpiringDocAlertProps { documentName: string; employeeName: string; expiryDate: string; daysRemaining: number; onUpload?: () => void; className?: string; }

export function ExpiringDocAlert({ documentName, employeeName, expiryDate, daysRemaining, onUpload, className }: ExpiringDocAlertProps) {
  const isExpired = daysRemaining < 0;
  const isUrgent = daysRemaining >= 0 && daysRemaining <= 7;

  return (
    <Card className={cn(isExpired ? "border-red-300 bg-red-50" : isUrgent ? "border-yellow-300 bg-yellow-50" : "", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileWarning className={cn("h-5 w-5", isExpired ? "text-red-600" : "text-yellow-600")} />
          <div className="flex-1">
            <p className="font-medium">{documentName}</p>
            <p className="text-sm text-muted-foreground">{employeeName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{isExpired ? "Vencido em:" : "Vence em:"} {expiryDate}</p>
            <p className={cn("text-sm font-medium mt-1", isExpired ? "text-red-600" : "text-yellow-600")}>{isExpired ? `Vencido há ${Math.abs(daysRemaining)} dias` : `${daysRemaining} dias restantes`}</p>
          </div>
          {onUpload && <Button size="sm" onClick={onUpload}><Upload className="h-4 w-4 mr-1" />Atualizar</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default ExpiringDocAlert;
