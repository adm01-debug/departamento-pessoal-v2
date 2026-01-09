import React from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, AlertTriangle, LucideIcon } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";
interface InlineAlertProps { type: AlertType; title?: string; message: string; className?: string; }

const icons: Record<AlertType, LucideIcon> = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle };
const variants: Record<AlertType, "default" | "destructive"> = { success: "default", error: "destructive", info: "default", warning: "default" };

export function InlineAlert({ type, title, message, className }: InlineAlertProps) {
  const Icon = icons[type];
  return (
    <Alert variant={variants[type]} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
export default InlineAlert;
