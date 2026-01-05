import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
const BANCOS = [{ codigo: "001", nome: "Banco do Brasil" }, { codigo: "033", nome: "Santander" }, { codigo: "104", nome: "Caixa" }, { codigo: "237", nome: "Bradesco" }, { codigo: "341", nome: "Itaú" }, { codigo: "756", nome: "Sicoob" }, { codigo: "077", nome: "Inter" }, { codigo: "260", nome: "Nubank" }];
export function DadosBancariosForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: { tipoConta: "CORRENTE", principal: true, ativo: true, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><Label>Banco *</Label><Select onValueChange={v => { const b = BANCOS.find(x => x.codigo === v); setValue("codigoBanco", v); setValue("banco", b?.nome || v); }}><SelectTrigger><SelectValue placeholder="Selecione o banco" /></SelectTrigger><SelectContent>{BANCOS.map(b => <SelectItem key={b.codigo} value={b.codigo}>{b.codigo} - {b.nome}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Agência *</Label><Input {...register("agencia")} placeholder="0000" /></div><div><Label>Dígito Agência</Label><Input {...register("digitoAgencia")} placeholder="0" maxLength={2} /></div></div>
      <div className="grid grid-cols-2 gap-4"><div><Label>Conta *</Label><Input {...register("conta")} placeholder="000000" /></div><div><Label>Dígito Conta</Label><Input {...register("digitoConta")} placeholder="0" maxLength={2} /></div></div>
      <div><Label>Tipo Conta *</Label><Select onValueChange={v => setValue("tipoConta", v)} defaultValue="CORRENTE"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CORRENTE">Corrente</SelectItem><SelectItem value="POUPANCA">Poupança</SelectItem><SelectItem value="SALARIO">Salário</SelectItem></SelectContent></Select></div>
      <div><Label>Chave PIX</Label><Input {...register("chavePix")} placeholder="CPF, email, telefone ou chave aleatória" /></div>
      <div className="flex items-center gap-2"><Switch checked={watch("principal")} onCheckedChange={v => setValue("principal", v)} /><Label>Conta Principal</Label></div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
    </form>
  );
}
export default DadosBancariosForm;
