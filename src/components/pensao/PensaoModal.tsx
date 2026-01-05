import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PensaoForm } from "./PensaoForm";
export function PensaoModal({ isOpen, onClose, pensaoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{pensaoId ? "Editar" : "Nova"} Pensão</DialogTitle></DialogHeader><PensaoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default PensaoModal;
