import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";

type AlertType = "info" | "success" | "warning" | "error";
interface AlertCardProps { type: AlertType; title: string; message: string; action?: { label: string; onClick: () => void }; onDismiss?: () => void; className?: string; }

const config = {
  info: { icon: Info, bg: "bg-blue-50 border-blue-200", iconColor: "text-blue-500" },
  success: { icon: CheckCircle, bg: "bg-green-50 border-green-200", iconColor: "text-green-500" },
  warning: { icon: AlertTriangle, bg: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-500" },
  error: { icon: XCircle, bg: "bg-red-50 border-red-200", iconColor: "text-red-500" },
};

export function AlertCard({ type, title, message, action, onDismiss, className }: AlertCardProps) {
  const { icon: Icon, bg, iconColor } = config[type];
  return (
    <Card className={cn("border", bg, className)}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColor)} />
          <div className="flex-1">
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            {action && <Button variant="link" className="p-0 h-auto mt-2" onClick={action.onClick}>{action.label}</Button>}
          </div>
          {onDismiss && <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={onDismiss}><X className="h-4 w-4" /></Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default AlertCard;
