import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DependenteForm } from "./DependenteForm";
export function DependenteModal({ isOpen, onClose, dependenteId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent><DialogHeader><DialogTitle>{dependenteId ? "Editar" : "Novo"} Dependente</DialogTitle></DialogHeader><DependenteForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default DependenteModal;
