import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RubricaForm } from "./RubricaForm";
export function RubricaModal({ isOpen, onClose, rubricaId, onSave, rubricas = [] }: any) {
  const rubrica = rubricaId ? rubricas.find((r:any) => r.id === rubricaId) : null;
  const handleSubmit = async (data: any) => { await onSave(data); onClose(); };
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{rubricaId ? "Editar" : "Nova"} Rubrica</DialogTitle></DialogHeader><RubricaForm defaultValues={rubrica} onSubmit={handleSubmit} /></DialogContent></Dialog>);
}
export default RubricaModal;
