import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TreinamentoForm } from "./TreinamentoForm";
export function TreinamentoModal({ isOpen, onClose, treinamentoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{treinamentoId ? "Editar" : "Novo"} Treinamento</DialogTitle></DialogHeader><TreinamentoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default TreinamentoModal;
