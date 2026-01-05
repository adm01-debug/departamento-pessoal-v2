import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function RescisaoForm({ defaultValues, onSubmit, isLoading }: any) {
  const { register, handleSubmit } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card><CardHeader><CardTitle className="text-sm">Proventos</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4">
        <div><Label>Saldo Salário</Label><Input {...register("saldoSalario", {valueAsNumber: true})} type="number" step="0.01" /></div>
        <div><Label>Aviso Prévio</Label><Input {...register("avisoPrevio", {valueAsNumber: true})} type="number" step="0.01" /></div>
        <div><Label>Férias + 1/3</Label><Input {...register("ferias", {valueAsNumber: true})} type="number" step="0.01" /></div>
        <div><Label>13º Proporcional</Label><Input {...register("decimoTerceiro", {valueAsNumber: true})} type="number" step="0.01" /></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm">FGTS</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4">
        <div><Label>Saldo FGTS</Label><Input {...register("fgts", {valueAsNumber: true})} type="number" step="0.01" /></div>
        <div><Label>Multa 40%</Label><Input {...register("multa40", {valueAsNumber: true})} type="number" step="0.01" /></div>
      </CardContent></Card>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Calculando..." : "Calcular Rescisão"}</Button>
    </form>
  );
}
export default RescisaoForm;
