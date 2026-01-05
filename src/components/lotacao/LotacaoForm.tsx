import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
const TIPOS = ["DEPARTAMENTO", "FILIAL", "CENTRO_CUSTO", "PROJETO", "OBRA"];
export function LotacaoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Código *</Label><Input {...register("codigo")} placeholder="CC001" /></div><div><Label>Descrição *</Label><Input {...register("descricao")} placeholder="Centro de Custo Administrativo" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo</Label><Select onValueChange={v => setValue("tipo", v)} defaultValue={defaultValues?.tipo || "CENTRO_CUSTO"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div><div><Label>Código Contábil</Label><Input {...register("codigoContabil")} placeholder="1.1.01.001" /></div></div>
      <div><Label>Código eSocial</Label><Input {...register("codigoESocial")} placeholder="Código para eSocial" /></div>
      <div className="flex items-center gap-2"><Switch checked={watch("ativo")} onCheckedChange={v => setValue("ativo", v)} /><Label>Ativo</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default LotacaoForm;
