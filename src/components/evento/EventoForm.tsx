import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export function EventoForm({ defaultValues, onSubmit, isLoading, rubricas = [] }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: { tipo: "PROVENTO", origem: "MANUAL", ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Rubrica *</Label><Select onValueChange={v => setValue("rubricaId", v)}><SelectTrigger><SelectValue placeholder="Selecione a rubrica" /></SelectTrigger><SelectContent>{rubricas.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.codigo} - {r.descricao}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo</Label><Select onValueChange={v => setValue("tipo", v)} defaultValue="PROVENTO"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PROVENTO">Provento</SelectItem><SelectItem value="DESCONTO">Desconto</SelectItem><SelectItem value="INFORMATIVO">Informativo</SelectItem></SelectContent></Select></div><div><Label>Origem</Label><Select onValueChange={v => setValue("origem", v)} defaultValue="MANUAL"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MANUAL">Manual</SelectItem><SelectItem value="CALCULADO">Calculado</SelectItem><SelectItem value="IMPORTADO">Importado</SelectItem></SelectContent></Select></div></div>
      <div className="grid grid-cols-3 gap-4"><div><Label>Quantidade</Label><Input {...register("quantidade", {valueAsNumber: true})} type="number" step="0.01" /></div><div><Label>Referência</Label><Input {...register("referencia", {valueAsNumber: true})} type="number" step="0.01" /></div><div><Label>Valor *</Label><Input {...register("valor", {valueAsNumber: true})} type="number" step="0.01" /></div></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default EventoForm;
