import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContratoForm } from "./ContratoForm";
export function ContratoModal({ isOpen, onClose, contratoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{contratoId ? "Editar" : "Novo"} Contrato</DialogTitle></DialogHeader><ContratoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default ContratoModal;
