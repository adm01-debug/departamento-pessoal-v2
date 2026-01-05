import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DemissaoForm } from "./DemissaoForm";
export function DemissaoModal({ isOpen, onClose, demissaoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{demissaoId ? "Editar" : "Nova"} Demissão</DialogTitle></DialogHeader><DemissaoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default DemissaoModal;
