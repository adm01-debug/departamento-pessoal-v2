/**
 * @fileoverview Modal de exclusão
 * @module components/modals/DeleteModal
 */
import { memo } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps { open: boolean; onOpenChange: (open: boolean) => void; titulo?: string; item?: string; onDelete: () => void; }

export const DeleteModal = memo(function DeleteModal({ open, onOpenChange, titulo = 'Excluir item', item, onDelete }: DeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="h-5 w-5" />{titulo}</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir {item || 'este item'}? Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
