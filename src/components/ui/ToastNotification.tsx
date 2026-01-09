import React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";
interface ToastNotificationProps { type: ToastType; title: string; message?: string; onClose?: () => void; className?: string; }

const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle };
const colors = { success: "border-green-500 bg-green-50", error: "border-red-500 bg-red-50", info: "border-blue-500 bg-blue-50", warning: "border-yellow-500 bg-yellow-50" };
const iconColors = { success: "text-green-500", error: "text-red-500", info: "text-blue-500", warning: "text-yellow-500" };

export function ToastNotification({ type, title, message, onClose, className }: ToastNotificationProps) {
  const Icon = icons[type];
  return (
    <div className={cn("flex items-start gap-3 p-4 border-l-4 rounded-r-lg shadow-lg", colors[type], className)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0", iconColors[type])} />
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {onClose && <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
    </div>
  );
}
export default ToastNotification;
