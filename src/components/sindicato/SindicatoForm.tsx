import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
export function SindicatoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Código *</Label><Input {...register("codigo")} /></div><div><Label>CNPJ</Label><Input {...register("cnpj")} placeholder="00.000.000/0000-00" /></div></div>
      <div><Label>Nome *</Label><Input {...register("nome")} placeholder="Nome do sindicato" /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Cidade</Label><Input {...register("cidade")} /></div><div><Label>UF</Label><Input {...register("uf")} maxLength={2} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Telefone</Label><Input {...register("telefone")} /></div><div><Label>Email</Label><Input {...register("email")} type="email" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Contrib. Sindical (%)</Label><Input {...register("contribuicaoSindical", {valueAsNumber: true})} type="number" step="0.01" /></div><div><Label>Contrib. Assistencial (%)</Label><Input {...register("contribuicaoAssistencial", {valueAsNumber: true})} type="number" step="0.01" /></div></div>
      <div className="flex items-center gap-2"><Switch checked={watch("ativo")} onCheckedChange={v => setValue("ativo", v)} /><Label>Ativo</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default SindicatoForm;
