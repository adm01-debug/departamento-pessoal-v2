import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["INDETERMINADO", "DETERMINADO", "EXPERIENCIA", "INTERMITENTE", "TEMPORARIO", "ESTAGIO", "APRENDIZ"];
const REGIMES = ["PRESENCIAL", "REMOTO", "HIBRIDO"];
export function ContratoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { tipo: "INDETERMINADO", regimeTrabalho: "PRESENCIAL", assinado: false, ativo: true, ...defaultValues } });
  const tipo = watch("tipo");
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Número</Label><Input {...register("numero")} placeholder="Número do contrato" /></div><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)} defaultValue={tipo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Início *</Label><Input {...register("dataInicio")} type="date" /></div>{(tipo === "DETERMINADO" || tipo === "EXPERIENCIA") && <div><Label>Data Fim</Label><Input {...register("dataFim")} type="date" /></div>}</div>
      {tipo === "EXPERIENCIA" && <div><Label>Término Experiência</Label><Input {...register("dataExperiencia")} type="date" /></div>}
      <div><Label>Regime de Trabalho</Label><Select onValueChange={v => setValue("regimeTrabalho", v)} defaultValue="PRESENCIAL"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{REGIMES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
      <div className="flex items-center gap-2"><Switch checked={watch("assinado")} onCheckedChange={v => setValue("assinado", v)} /><Label>Contrato Assinado</Label></div>
      <div><Label>Observação</Label><Textarea {...register("observacao")} rows={2} /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default ContratoForm;
