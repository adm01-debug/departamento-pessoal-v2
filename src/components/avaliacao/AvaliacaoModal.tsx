import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvaliacaoForm } from "./AvaliacaoForm";
export function AvaliacaoModal({ isOpen, onClose, avaliacaoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{avaliacaoId ? "Editar" : "Nova"} Avaliação</DialogTitle></DialogHeader><AvaliacaoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default AvaliacaoModal;
