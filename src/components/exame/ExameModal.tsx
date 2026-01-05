import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExameForm } from "./ExameForm";
export function ExameModal({ isOpen, onClose, exameId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle>{exameId ? "Editar" : "Novo"} Exame</DialogTitle></DialogHeader><ExameForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default ExameModal;
