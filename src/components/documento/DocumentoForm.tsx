import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const TIPOS = ["RG", "CPF", "CTPS", "CNH", "TITULO_ELEITOR", "RESERVISTA", "COMPROVANTE_RESIDENCIA", "CERTIFICADO", "CONTRATO", "TERMO", "ATESTADO", "OUTROS"];
export function DocumentoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4"><div><Label>Tipo *</Label><Select onValueChange={v => setValue("tipo", v)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div><div><Label>Nome *</Label><Input {...register("nome")} placeholder="Nome do documento" /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Número</Label><Input {...register("numero")} /></div><div><Label>Órgão Emissor</Label><Input {...register("orgaoEmissor")} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Data Emissão</Label><Input {...register("dataEmissao")} type="date" /></div><div><Label>Data Validade</Label><Input {...register("dataValidade")} type="date" /></div></div>
      <div><Label>Arquivo</Label><Input type="file" className="cursor-pointer" /></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default DocumentoForm;
