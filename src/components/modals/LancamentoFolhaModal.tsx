import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { DollarSign } from "lucide-react";
interface LancamentoFolhaModalProps { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; competencia: string; colaborador?: { id: string; nome: string }; }
export function LancamentoFolhaModal({ isOpen, onClose, onSubmit, competencia, colaborador }: LancamentoFolhaModalProps) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const onFormSubmit = (data: any) => { onSubmit({ ...data, colaboradorId: colaborador?.id, competencia }); reset(); onClose(); };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-500" />Lançamento na Folha</DialogTitle></DialogHeader><div className="p-3 bg-muted rounded-lg mb-4"><p className="text-sm text-muted-foreground">Competência: {competencia}</p>{colaborador && <p className="font-medium">{colaborador.nome}</p>}</div><form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4"><div><Label>Rubrica *</Label><Select onValueChange={v => setValue("rubricaId", v)}><SelectTrigger><SelectValue placeholder="Selecione a rubrica" /></SelectTrigger><SelectContent><SelectItem value="1001">1001 - Hora Extra 50%</SelectItem><SelectItem value="1002">1002 - Hora Extra 100%</SelectItem><SelectItem value="1003">1003 - Adicional Noturno</SelectItem><SelectItem value="2001">2001 - Vale Transporte</SelectItem><SelectItem value="2002">2002 - Vale Refeição</SelectItem></SelectContent></Select></div><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="PROVENTO">Provento</SelectItem><SelectItem value="DESCONTO">Desconto</SelectItem></SelectContent></Select></div><div className="grid grid-cols-2 gap-4"><div><Label>Referência (qtd/hrs)</Label><Input {...register("referencia", { valueAsNumber: true })} type="number" step="0.01" /></div><div><Label>Valor (R$) *</Label><Input {...register("valor", { valueAsNumber: true })} type="number" step="0.01" /></div></div><DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit">Lançar</Button></DialogFooter></form></DialogContent></Dialog>
  );
}
export default LancamentoFolhaModal;
