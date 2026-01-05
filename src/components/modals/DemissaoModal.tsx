import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
interface DemissaoModalProps { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; colaborador?: { id: string; nome: string }; }
export function DemissaoModal({ isOpen, onClose, onSubmit, colaborador }: DemissaoModalProps) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const onFormSubmit = (data: any) => { onSubmit({ ...data, colaboradorId: colaborador?.id }); reset(); onClose(); };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" />Demissão</DialogTitle></DialogHeader>{colaborador && <div className="p-3 bg-muted rounded-lg"><p className="font-medium">{colaborador.nome}</p></div>}<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4"><div><Label>Data Demissão *</Label><Input {...register("dataDemissao")} type="date" /></div><div><Label>Tipo de Demissão *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="SEM_JUSTA_CAUSA">Sem Justa Causa</SelectItem><SelectItem value="JUSTA_CAUSA">Justa Causa</SelectItem><SelectItem value="PEDIDO">Pedido de Demissão</SelectItem><SelectItem value="ACORDO">Acordo</SelectItem></SelectContent></Select></div><div><Label>Motivo</Label><Textarea {...register("motivo")} rows={3} placeholder="Descreva o motivo da demissão" /></div><DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" variant="destructive">Confirmar Demissão</Button></DialogFooter></form></DialogContent></Dialog>
  );
}
export default DemissaoModal;
