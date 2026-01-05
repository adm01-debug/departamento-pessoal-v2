import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RescisaoForm } from "./RescisaoForm";
export function RescisaoModal({ isOpen, onClose, rescisaoId, onSave }: any) {
  return (<Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Cálculo de Rescisão</DialogTitle></DialogHeader><RescisaoForm onSubmit={async (data: any) => { await onSave(data); onClose(); }} /></DialogContent></Dialog>);
}
export default RescisaoModal;
