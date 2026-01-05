import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
export function PensaoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { tipoCalculo: "PERCENTUAL", baseCalculo: "LIQUIDO", ativo: true, ...defaultValues } });
  const tipo = watch("tipoCalculo");
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Beneficiário *</Label><Input {...register("beneficiario")} placeholder="Nome do beneficiário" /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>CPF Beneficiário</Label><Input {...register("cpfBeneficiario")} /></div><div><Label>Nº Processo</Label><Input {...register("numeroProcesso")} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo Cálculo</Label><Select onValueChange={v => setValue("tipoCalculo", v)} defaultValue={tipo}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PERCENTUAL">Percentual</SelectItem><SelectItem value="VALOR_FIXO">Valor Fixo</SelectItem></SelectContent></Select></div>{tipo === "PERCENTUAL" ? <div><Label>Percentual (%)</Label><Input {...register("percentual", {valueAsNumber: true})} type="number" step="0.01" /></div> : <div><Label>Valor Fixo</Label><Input {...register("valorFixo", {valueAsNumber: true})} type="number" step="0.01" /></div>}</div>
      <div className="grid grid-cols-3 gap-4"><div><Label>Banco</Label><Input {...register("banco")} /></div><div><Label>Agência</Label><Input {...register("agencia")} /></div><div><Label>Conta</Label><Input {...register("conta")} /></div></div>
      <div className="flex items-center gap-2"><Switch checked={watch("ativo")} onCheckedChange={v => setValue("ativo", v)} /><Label>Ativo</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default PensaoForm;
