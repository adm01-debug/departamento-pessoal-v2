/**
 * @fileoverview Dialog de confirmação
 * @module components/common/ConfirmDialog
 */
import { memo } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titulo: string;
  descricao: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
}

export const ConfirmDialog = memo(function ConfirmDialog({
  open, onOpenChange, titulo, descricao, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'default', onConfirm
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === 'destructive' && <AlertTriangle className="h-5 w-5 text-destructive" />}
            {titulo}
          </AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
