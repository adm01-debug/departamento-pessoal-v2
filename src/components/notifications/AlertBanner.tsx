import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
interface AlertBannerProps { type: "success" | "error" | "warning" | "info"; title: string; description?: string; dismissible?: boolean; onDismiss?: () => void; action?: { label: string; onClick: () => void }; className?: string; }
const variants = { success: { icon: CheckCircle, className: "border-green-200 bg-green-50 text-green-800" }, error: { icon: XCircle, className: "border-red-200 bg-red-50 text-red-800" }, warning: { icon: AlertTriangle, className: "border-yellow-200 bg-yellow-50 text-yellow-800" }, info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-800" } };
export function AlertBanner({ type, title, description, dismissible, onDismiss, action, className }: AlertBannerProps) {
  const { icon: Icon, className: variantClass } = variants[type];
  return (<Alert className={cn(variantClass, "relative", className)}><Icon className="h-4 w-4" /><AlertTitle>{title}</AlertTitle>{description && <AlertDescription>{description}</AlertDescription>}{action && <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={action.onClick}>{action.label}</Button>}{dismissible && <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onDismiss}><X className="h-4 w-4" /></Button>}</Alert>);
}
export default AlertBanner;
