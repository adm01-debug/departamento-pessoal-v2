import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Clock } from "lucide-react";
interface TratamentoPontoModalProps { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; inconsistencia?: { id: string; colaborador: string; data: string; tipo: string }; }
export function TratamentoPontoModal({ isOpen, onClose, onSubmit, inconsistencia }: TratamentoPontoModalProps) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const onFormSubmit = (data: any) => { onSubmit({ ...data, inconsistenciaId: inconsistencia?.id }); reset(); onClose(); };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}><DialogContent className="max-w-lg"><DialogHeader><DialogTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-yellow-500" />Tratar Inconsistência</DialogTitle></DialogHeader>{inconsistencia && <div className="p-3 bg-yellow-50 rounded-lg mb-4"><p className="font-medium">{inconsistencia.colaborador}</p><p className="text-sm text-muted-foreground">{inconsistencia.data} - {inconsistencia.tipo}</p></div>}<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4"><div><Label>Ação *</Label><Select onValueChange={v => setValue("acao", v)}><SelectTrigger><SelectValue placeholder="Selecione a ação" /></SelectTrigger><SelectContent><SelectItem value="JUSTIFICAR">Justificar</SelectItem><SelectItem value="ABONAR">Abonar</SelectItem><SelectItem value="AUTORIZAR">Autorizar HE</SelectItem><SelectItem value="DESCONTAR">Descontar</SelectItem><SelectItem value="IGNORAR">Ignorar</SelectItem></SelectContent></Select></div><div className="grid grid-cols-2 gap-4"><div><Label>Hora Entrada</Label><Input {...register("horaEntrada")} type="time" /></div><div><Label>Hora Saída</Label><Input {...register("horaSaida")} type="time" /></div></div><div><Label>Justificativa</Label><Textarea {...register("justificativa")} rows={3} placeholder="Descreva a justificativa" /></div><DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit">Aplicar</Button></DialogFooter></form></DialogContent></Dialog>
  );
}
export default TratamentoPontoModal;
