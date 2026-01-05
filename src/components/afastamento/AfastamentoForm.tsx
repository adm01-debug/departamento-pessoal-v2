import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["DOENCA", "ACIDENTE_TRABALHO", "MATERNIDADE", "PATERNIDADE", "SERVICO_MILITAR", "MANDATO_SINDICAL", "OUTROS"];
export function AfastamentoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { inss: false, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Início *</Label><Input {...register("dataInicio")} type="date" /></div><div><Label>Data Fim</Label><Input {...register("dataFim")} type="date" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div><div><Label>Dias</Label><Input {...register("dias", {valueAsNumber: true})} type="number" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>CID</Label><Input {...register("cid")} placeholder="Código CID" /></div><div><Label>CRM Médico</Label><Input {...register("crm")} placeholder="CRM" /></div></div>
      <div className="flex items-center gap-2"><Switch checked={watch("inss")} onCheckedChange={v => setValue("inss", v)} /><Label>Encaminhado ao INSS</Label></div>
      <div><Label>Observação</Label><Textarea {...register("observacao")} rows={2} /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Registrar Afastamento"}</Button>
    </form>
  );
}
export default AfastamentoForm;
