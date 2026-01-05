import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DadosBancariosForm } from "./DadosBancariosForm";
export function DadosBancariosModal({ isOpen, onClose, contaId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent><DialogHeader><DialogTitle>{contaId ? "Editar" : "Nova"} Conta Bancária</DialogTitle></DialogHeader><DadosBancariosForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default DadosBancariosModal;
