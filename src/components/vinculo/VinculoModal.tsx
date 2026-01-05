import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VinculoForm } from "./VinculoForm";
export function VinculoModal({ isOpen, onClose, vinculoId, onSave, vinculos = [] }: any) {
  const vinculo = vinculoId ? vinculos.find((v:any) => v.id === vinculoId) : null;
  const handleSubmit = async (data: any) => { await onSave(data); onClose(); };
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{vinculoId ? "Editar" : "Novo"} Vínculo</DialogTitle></DialogHeader><VinculoForm defaultValues={vinculo} onSubmit={handleSubmit} /></DialogContent></Dialog>);
}
export default VinculoModal;
