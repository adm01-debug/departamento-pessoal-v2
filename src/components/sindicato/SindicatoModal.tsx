import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SindicatoForm } from "./SindicatoForm";
export function SindicatoModal({ isOpen, onClose, sindicatoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{sindicatoId ? "Editar" : "Novo"} Sindicato</DialogTitle></DialogHeader><SindicatoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default SindicatoModal;
