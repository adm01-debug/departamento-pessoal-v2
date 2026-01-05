import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
const TIPOS = ["GERAL", "RH", "FINANCEIRO", "TI", "SEGURANCA", "URGENTE"];
const PRIORIDADES = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];
export function ComunicadoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: { prioridade: "MEDIA", ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Título *</Label><Input {...register("titulo")} placeholder="Título do comunicado" /></div>
      <div><Label>Conteúdo *</Label><Textarea {...register("conteudo")} rows={6} placeholder="Conteúdo do comunicado..." /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div><div><Label>Prioridade *</Label><Select onValueChange={v => setValue("prioridade", v)} defaultValue="MEDIA"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRIORIDADES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Publicação *</Label><Input {...register("dataPublicacao")} type="date" /></div><div><Label>Data Expiração</Label><Input {...register("dataExpiracao")} type="date" /></div></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</Button>
    </form>
  );
}
export default ComunicadoForm;
