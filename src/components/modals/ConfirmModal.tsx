/**
 * @fileoverview Modal de confirmação
 * @module components/modals/ConfirmModal
 */
import { memo } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface ConfirmModalProps { open: boolean; onOpenChange: (open: boolean) => void; titulo: string; mensagem: string; onConfirm: () => void; confirmLabel?: string; cancelLabel?: string; }

export const ConfirmModal = memo(function ConfirmModal({ open, onOpenChange, titulo, mensagem, onConfirm, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{titulo}</AlertDialogTitle><AlertDialogDescription>{mensagem}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>{cancelLabel}</AlertDialogCancel><AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
