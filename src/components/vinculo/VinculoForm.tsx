import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const TIPOS = ["CLT", "ESTAGIO", "TEMPORARIO", "AUTONOMO", "PJ", "AVULSO", "DOMESTICO", "APRENDIZ"];
export function VinculoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Matrícula</Label><Input {...register("matricula")} /></div><div><Label>Tipo</Label><Select onValueChange={v => setValue("tipoVinculo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Admissão</Label><Input {...register("dataAdmissao")} type="date" /></div><div><Label>Salário Base</Label><Input {...register("salarioBase", {valueAsNumber:true})} type="number" step="0.01" /></div></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default VinculoForm;
