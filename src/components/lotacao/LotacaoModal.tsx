import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LotacaoForm } from "./LotacaoForm";
export function LotacaoModal({ isOpen, onClose, lotacaoId, onSave, lotacoes = [] }: any) {
  const lotacao = lotacaoId ? lotacoes.find((l:any) => l.id === lotacaoId) : null;
  const handleSubmit = async (data: any) => { await onSave(data); onClose(); };
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{lotacaoId ? "Editar" : "Nova"} Lotação</DialogTitle></DialogHeader><LotacaoForm defaultValues={lotacao} onSubmit={handleSubmit} /></DialogContent></Dialog>);
}
export default LotacaoModal;
