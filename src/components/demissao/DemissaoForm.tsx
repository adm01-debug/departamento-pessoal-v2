import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["SEM_JUSTA_CAUSA", "JUSTA_CAUSA", "PEDIDO", "ACORDO"];
export function DemissaoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Colaborador *</Label><Input {...register("colaboradorId")} placeholder="Selecione o colaborador" /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Demissão *</Label><Input {...register("data")} type="date" /></div><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div></div>
      <div><Label>Motivo</Label><Textarea {...register("motivo")} rows={3} /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Registrar Demissão"}</Button>
    </form>
  );
}
export default DemissaoForm;
