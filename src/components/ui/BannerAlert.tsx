import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, LucideIcon } from "lucide-react";

interface BannerAlertProps { icon?: LucideIcon; message: string; actionLabel?: string; onAction?: () => void; onDismiss?: () => void; variant?: "info" | "warning" | "error"; className?: string; }

const variants = { info: "bg-blue-500", warning: "bg-yellow-500", error: "bg-red-500" };

export function BannerAlert({ icon: Icon, message, actionLabel, onAction, onDismiss, variant = "info", className }: BannerAlertProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4 px-4 py-3 text-white", variants[variant], className)}>
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
      {actionLabel && onAction && <Button variant="secondary" size="sm" onClick={onAction}>{actionLabel}</Button>}
      {onDismiss && <button onClick={onDismiss} className="ml-auto hover:opacity-80"><X className="h-4 w-4" /></button>}
    </div>
  );
}
export default BannerAlert;
