import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const TIPOS = ["PROVENTO", "DESCONTO", "INFORMATIVA"];
const NATUREZAS = ["SALARIO", "HORA_EXTRA", "DSR", "ADICIONAL_NOTURNO", "INSALUBRIDADE", "PERICULOSIDADE", "COMISSAO", "FERIAS", "13_SALARIO", "BENEFICIO", "IMPOSTO", "CONTRIBUICAO", "OUTROS"];
export function RubricaForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { tipo: "PROVENTO", natureza: "SALARIO", incideINSS: true, incideIRRF: true, incideFGTS: true, incideFerias: true, incide13: true, ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Código *</Label><Input {...register("codigo")} placeholder="1000" /></div><div><Label>Descrição *</Label><Input {...register("descricao")} placeholder="Salário Base" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo</Label><Select onValueChange={v => setValue("tipo", v)} defaultValue={watch("tipo")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div><div><Label>Natureza</Label><Select onValueChange={v => setValue("natureza", v)} defaultValue={watch("natureza")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{NATUREZAS.map(n => <SelectItem key={n} value={n}>{n.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div></div>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Incidências</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-4">{["incideINSS", "incideIRRF", "incideFGTS", "incideFerias", "incide13"].map(field => <div key={field} className="flex items-center gap-2"><Switch checked={watch(field)} onCheckedChange={v => setValue(field, v)} /><Label className="text-sm">{field.replace("incide", "")}</Label></div>)}</div></CardContent></Card>
      <div><Label>Código eSocial</Label><Input {...register("codigoESocial")} placeholder="Código tabela eSocial" /></div>
      <div className="flex items-center gap-2"><Switch checked={watch("ativo")} onCheckedChange={v => setValue("ativo", v)} /><Label>Ativo</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default RubricaForm;
