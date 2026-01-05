import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
const TIPOS = ["NR", "INTEGRACAO", "TECNICO", "COMPORTAMENTAL", "OBRIGATORIO", "DESENVOLVIMENTO"];
const MODALIDADES = ["PRESENCIAL", "ONLINE", "HIBRIDO"];
export function TreinamentoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Nome *</Label><Input {...register("nome")} placeholder="Nome do treinamento" /></div>
      <div><Label>Descrição</Label><Textarea {...register("descricao")} rows={2} /></div>
      <div className="grid grid-cols-3 gap-4"><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div><div><Label>Modalidade *</Label><Select onValueChange={v => setValue("modalidade", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div><div><Label>Carga Horária *</Label><Input {...register("cargaHoraria", {valueAsNumber: true})} type="number" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Instrutor</Label><Input {...register("instrutor")} /></div><div><Label>Fornecedor</Label><Input {...register("fornecedor")} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Validade (meses)</Label><Input {...register("validade", {valueAsNumber: true})} type="number" /></div><div><Label>Custo (R$)</Label><Input {...register("custo", {valueAsNumber: true})} type="number" step="0.01" /></div></div>
      <div className="flex items-center gap-2"><Switch checked={watch("ativo")} onCheckedChange={v => setValue("ativo", v)} /><Label>Ativo</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default TreinamentoForm;
