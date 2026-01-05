import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["CONSIGNADO", "ANTECIPACAO_SALARIAL", "ADIANTAMENTO", "VALE"];
export function EmprestimoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { tipo: "CONSIGNADO", parcelasPagas: 0, diaDesconto: 5, situacao: "ATIVO", ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo</Label><Select onValueChange={v => setValue("tipo", v)} defaultValue={watch("tipo")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div><div><Label>Contrato</Label><Input {...register("contrato")} placeholder="Número do contrato" /></div></div>
      <div className="grid grid-cols-3 gap-4"><div><Label>Valor Total *</Label><Input {...register("valorTotal", {valueAsNumber:true})} type="number" step="0.01" /></div><div><Label>Nº Parcelas *</Label><Input {...register("quantidadeParcelas", {valueAsNumber:true})} type="number" /></div><div><Label>Valor Parcela *</Label><Input {...register("valorParcela", {valueAsNumber:true})} type="number" step="0.01" /></div></div>
      <div className="grid grid-cols-3 gap-4"><div><Label>Taxa Juros (%)</Label><Input {...register("taxaJuros", {valueAsNumber:true})} type="number" step="0.01" /></div><div><Label>Data Início</Label><Input {...register("dataInicio")} type="date" /></div><div><Label>Dia Desconto</Label><Input {...register("diaDesconto", {valueAsNumber:true})} type="number" min="1" max="31" /></div></div>
      <div><Label>Observação</Label><Textarea {...register("observacao")} rows={3} /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default EmprestimoForm;
