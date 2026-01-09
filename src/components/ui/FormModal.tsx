import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: React.ReactNode; onSubmit: () => void; submitLabel?: string; loading?: boolean; }

export function FormModal({ open, onOpenChange, title, description, children, onSubmit, submitLabel = "Salvar", loading }: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSubmit} disabled={loading}>{loading ? "Salvando..." : submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default FormModal;
