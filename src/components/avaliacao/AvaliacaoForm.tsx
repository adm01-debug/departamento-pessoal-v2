import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["90_DIAS", "ANUAL", "SEMESTRAL", "PROMOCAO", "FEEDBACK"];
export function AvaliacaoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: { status: "PENDENTE", ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Período *</Label><Input {...register("periodo")} placeholder="Ex: 2025-1" /></div><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Início *</Label><Input {...register("dataInicio")} type="date" /></div><div><Label>Data Fim</Label><Input {...register("dataFim")} type="date" /></div></div>
      <div><Label>Comentário do Gestor</Label><Textarea {...register("comentarioGestor")} rows={3} /></div>
      <div><Label>Nota Final (0-10)</Label><Input {...register("notaFinal", {valueAsNumber: true})} type="number" min="0" max="10" step="0.1" /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default AvaliacaoForm;
