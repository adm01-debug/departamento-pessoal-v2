import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentoForm } from "./DocumentoForm";
export function DocumentoModal({ isOpen, onClose, documentoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent><DialogHeader><DialogTitle>{documentoId ? "Editar" : "Novo"} Documento</DialogTitle></DialogHeader><DocumentoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default DocumentoModal;
