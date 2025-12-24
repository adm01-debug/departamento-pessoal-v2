/**
 * @fileoverview Modal de alerta
 * @module components/modals/AlertModal
 */
import { memo } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertTriangle, Info } from 'lucide-react';

interface AlertModalProps { open: boolean; onOpenChange: (open: boolean) => void; titulo: string; mensagem: string; tipo?: 'info' | 'warning'; }

export const AlertModal = memo(function AlertModal({ open, onOpenChange, titulo, mensagem, tipo = 'info' }: AlertModalProps) {
  const Icon = tipo === 'warning' ? AlertTriangle : Info;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2"><Icon className={`h-5 w-5 ${tipo === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />{titulo}</AlertDialogTitle><AlertDialogDescription>{mensagem}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
