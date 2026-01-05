import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmprestimoForm } from "./EmprestimoForm";
export function EmprestimoModal({ isOpen, onClose, emprestimoId, onSave, emprestimos = [] }: any) {
  const emprestimo = emprestimoId ? emprestimos.find((e:any) => e.id === emprestimoId) : null;
  const handleSubmit = async (data: any) => { await onSave(data); onClose(); };
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{emprestimoId ? "Editar" : "Novo"} Empréstimo</DialogTitle></DialogHeader><EmprestimoForm defaultValues={emprestimo} onSubmit={handleSubmit} /></DialogContent></Dialog>);
}
export default EmprestimoModal;
