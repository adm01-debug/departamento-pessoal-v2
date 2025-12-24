import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
interface ConfirmModalProps { open: boolean; onOpenChange: (o: boolean) => void; title: string; message: string; onConfirm: () => void; }
export const ConfirmModal = memo(function ConfirmModal({ open, onOpenChange, title, message, onConfirm }: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader><p>{message}</p><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={() => { onConfirm(); onOpenChange(false); }}>Confirmar</Button></DialogFooter></DialogContent>
    </Dialog>
  );
});
