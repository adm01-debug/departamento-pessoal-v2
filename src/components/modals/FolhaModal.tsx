import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FolhaModalProps { open: boolean; onOpenChange: (open: boolean) => void; data?: any; onConfirm?: (data?: any) => void; title?: string; loading?: boolean; }

export function FolhaModal({ open, onOpenChange, data, onConfirm, title = "FolhaModal", loading = false }: FolhaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="py-4">{data ? <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-64">{JSON.stringify(data, null, 2)}</pre> : <p className="text-muted-foreground text-center">Nenhum dado disponível</p>}</div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={() => { onConfirm?.(data); onOpenChange(false); }} disabled={loading}>{loading ? "Processando..." : "Confirmar"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default FolhaModal;
