import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jornadaSchema } from "@/schemas/jornadaSchema";
import { JornadaFormData, TipoJornada } from "@/types/jornada.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface JornadaFormProps {
  defaultValues?: Partial<JornadaFormData>;
  onSubmit: (data: JornadaFormData) => void;
  isLoading?: boolean;
}

const TIPOS: { value: TipoJornada; label: string }[] = [
  { value: "NORMAL", label: "Normal" },
  { value: "FLEXIVEL", label: "Flexível" },
  { value: "ESCALA", label: "Escala" },
  { value: "PLANTAO", label: "Plantão" },
  { value: "INTERMITENTE", label: "Intermitente" },
];

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function JornadaForm({ defaultValues, onSubmit, isLoading }: JornadaFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JornadaFormData>({
    resolver: zodResolver(jornadaSchema),
    defaultValues: { tipo: "NORMAL", diasSemana: [1,2,3,4,5], toleranciaEntrada: 10, toleranciaSaida: 10, permiteHoraExtra: true, permiteBancoHoras: false, ativo: true, ...defaultValues },
  });

  const diasSemana = watch("diasSemana") || [];
  const toggleDia = (dia: number) => {
    const newDias = diasSemana.includes(dia) ? diasSemana.filter(d => d !== dia) : [...diasSemana, dia];
    setValue("diasSemana", newDias);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Código *</Label><Input {...register("codigo")} placeholder="JOR001" />{errors.codigo && <span className="text-red-500 text-sm">{errors.codigo.message}</span>}</div>
        <div><Label>Descrição *</Label><Input {...register("descricao")} placeholder="Jornada Comercial" />{errors.descricao && <span className="text-red-500 text-sm">{errors.descricao.message}</span>}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div><Label>Hora Início *</Label><Input {...register("horaInicio")} type="time" /></div>
        <div><Label>Hora Fim *</Label><Input {...register("horaFim")} type="time" /></div>
        <div><Label>Intervalo Início</Label><Input {...register("intervaloInicio")} type="time" /></div>
        <div><Label>Intervalo Fim</Label><Input {...register("intervaloFim")} type="time" /></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><Label>Carga Diária (h)</Label><Input {...register("cargaHorariaDiaria", { valueAsNumber: true })} type="number" step="0.5" /></div>
        <div><Label>Carga Semanal (h)</Label><Input {...register("cargaHorariaSemanal", { valueAsNumber: true })} type="number" /></div>
        <div><Label>Carga Mensal (h)</Label><Input {...register("cargaHorariaMensal", { valueAsNumber: true })} type="number" /></div>
      </div>

      <div><Label>Tipo</Label><Select onValueChange={v => setValue("tipo", v as TipoJornada)} defaultValue={defaultValues?.tipo || "NORMAL"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>

      <Card><CardContent className="pt-4"><Label>Dias da Semana</Label><div className="flex gap-2 mt-2">{DIAS.map((dia, i) => <Button key={i} type="button" variant={diasSemana.includes(i) ? "default" : "outline"} size="sm" onClick={() => toggleDia(i)}>{dia}</Button>)}</div></CardContent></Card>

      <div className="grid grid-cols-2 gap-4">
        <div><Label>Tolerância Entrada (min)</Label><Input {...register("toleranciaEntrada", { valueAsNumber: true })} type="number" /></div>
        <div><Label>Tolerância Saída (min)</Label><Input {...register("toleranciaSaida", { valueAsNumber: true })} type="number" /></div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2"><Switch {...register("permiteHoraExtra")} /><Label>Permite Hora Extra</Label></div>
        <div className="flex items-center gap-2"><Switch {...register("permiteBancoHoras")} /><Label>Permite Banco de Horas</Label></div>
        <div className="flex items-center gap-2"><Switch {...register("ativo")} /><Label>Ativo</Label></div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar Jornada"}</Button>
    </form>
  );
}

export default JornadaForm;
