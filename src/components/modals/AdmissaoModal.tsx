import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
interface AdmissaoModalProps { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; }
export function AdmissaoModal({ isOpen, onClose, onSubmit }: AdmissaoModalProps) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const onFormSubmit = (data: any) => { onSubmit(data); reset(); onClose(); };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Nova Admissão</DialogTitle></DialogHeader><form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Nome Completo *</Label><Input {...register("nome")} /></div><div><Label>CPF *</Label><Input {...register("cpf")} /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>Email</Label><Input {...register("email")} type="email" /></div><div><Label>Telefone</Label><Input {...register("telefone")} /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>Data Admissão *</Label><Input {...register("dataAdmissao")} type="date" /></div><div><Label>Salário Base *</Label><Input {...register("salarioBase")} type="number" step="0.01" /></div></div><div className="grid grid-cols-2 gap-4"><div><Label>Departamento</Label><Select onValueChange={v => setValue("departamento", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="ti">TI</SelectItem><SelectItem value="rh">RH</SelectItem><SelectItem value="comercial">Comercial</SelectItem><SelectItem value="financeiro">Financeiro</SelectItem></SelectContent></Select></div><div><Label>Cargo</Label><Input {...register("cargo")} /></div></div><div><Label>Observações</Label><Textarea {...register("observacoes")} rows={3} /></div><DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit">Admitir</Button></DialogFooter></form></DialogContent></Dialog>
  );
}
export default AdmissaoModal;
