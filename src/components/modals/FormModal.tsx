/**
 * @fileoverview Modal de formulário
 * @module components/modals/FormModal
 */
import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormModalProps { open: boolean; onOpenChange: (open: boolean) => void; titulo: string; children: React.ReactNode; onSubmit: () => void; submitLabel?: string; loading?: boolean; }

export const FormModal = memo(function FormModal({ open, onOpenChange, titulo, children, onSubmit, submitLabel = 'Salvar', loading }: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent><DialogHeader><DialogTitle>{titulo}</DialogTitle></DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button><Button onClick={onSubmit} disabled={loading}>{loading ? 'Salvando...' : submitLabel}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
