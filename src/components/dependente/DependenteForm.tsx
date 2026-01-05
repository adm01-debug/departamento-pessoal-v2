import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
const PARENTESCOS = ["CONJUGE", "FILHO", "ENTEADO", "PAI", "MAE", "IRMAO", "AVO", "OUTROS"];
export function DependenteForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { ativo: true, irrf: false, salarioFamilia: false, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Nome *</Label><Input {...register("nome")} /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>CPF</Label><Input {...register("cpf")} /></div><div><Label>Data Nascimento *</Label><Input {...register("dataNascimento")} type="date" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Parentesco *</Label><Select onValueChange={v => setValue("parentesco", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{PARENTESCOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div><div><Label>Sexo *</Label><Select onValueChange={v => setValue("sexo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="M">Masculino</SelectItem><SelectItem value="F">Feminino</SelectItem></SelectContent></Select></div></div>
      <div className="grid grid-cols-2 gap-4"><div className="flex items-center gap-2"><Switch checked={watch("irrf")} onCheckedChange={v => setValue("irrf", v)} /><Label>Deduz IRRF</Label></div><div className="flex items-center gap-2"><Switch checked={watch("salarioFamilia")} onCheckedChange={v => setValue("salarioFamilia", v)} /><Label>Salário Família</Label></div></div>
      <div className="grid grid-cols-2 gap-4"><div className="flex items-center gap-2"><Switch checked={watch("planoSaude")} onCheckedChange={v => setValue("planoSaude", v)} /><Label>Plano Saúde</Label></div><div className="flex items-center gap-2"><Switch checked={watch("invalidez")} onCheckedChange={v => setValue("invalidez", v)} /><Label>Invalidez</Label></div></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default DependenteForm;
