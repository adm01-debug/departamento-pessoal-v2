import React from "react";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

type DialogVariant = "default" | "warning" | "danger" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", variant = "default", onConfirm, onCancel, isLoading = false }: ConfirmDialogProps) {
  const icons = { default: <Info className="h-6 w-6 text-blue-500" />, warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />, danger: <XCircle className="h-6 w-6 text-red-500" />, success: <CheckCircle className="h-6 w-6 text-green-500" /> };
  const buttonVariants = { default: "", warning: "bg-yellow-500 hover:bg-yellow-600", danger: "bg-red-500 hover:bg-red-600", success: "bg-green-500 hover:bg-green-600" };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {icons[variant]}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className={buttonVariants[variant]}>{isLoading ? "Aguarde..." : confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ConfirmDialog;
