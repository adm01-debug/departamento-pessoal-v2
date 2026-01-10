// V14-026: BancoHorasForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bancoHorasSchema = z.object({
  colaboradorId: z.string().min(1, "Selecione o colaborador"),
  tipo: z.enum(["credito", "debito"]),
  horas: z.coerce.number().min(0.5, "Mínimo 30 minutos"),
  minutos: z.coerce.number().min(0).max(59).default(0),
  data: z.string().min(1, "Data obrigatória"),
  motivo: z.string().min(1, "Motivo obrigatório"),
  observacoes: z.string().optional(),
});

type BancoHorasFormData = z.infer<typeof bancoHorasSchema>;

interface BancoHorasFormProps {
  initialData?: Partial<BancoHorasFormData>;
  onSubmit: (data: BancoHorasFormData) => void;
  onCancel: () => void;
  colaboradores: Array<{ id: string; nome: string }>;
}

const motivosCredito = [
  { value: "hora_extra", label: "Hora Extra" },
  { value: "compensacao", label: "Compensação" },
  { value: "ajuste", label: "Ajuste Manual" },
];

const motivosDebito = [
  { value: "folga", label: "Folga" },
  { value: "saida_antecipada", label: "Saída Antecipada" },
  { value: "atraso", label: "Atraso" },
  { value: "falta", label: "Falta" },
  { value: "ajuste", label: "Ajuste Manual" },
];

export function BancoHorasForm({ initialData, onSubmit, onCancel, colaboradores }: BancoHorasFormProps) {
  const form = useForm<BancoHorasFormData>({
    resolver: zodResolver(bancoHorasSchema),
    defaultValues: initialData || { tipo: "credito", minutos: 0 },
  });

  const tipo = form.watch("tipo");
  const motivos = tipo === "credito" ? motivosCredito : motivosDebito;

  return (
    <Card>
      <CardHeader><CardTitle>{initialData ? "Editar Lançamento" : "Novo Lançamento"}</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="colaboradorId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Colaborador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{colaboradores.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="credito">Crédito (+)</SelectItem>
                      <SelectItem value="debito">Débito (-)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="horas" render={({ field }) => (
                <FormItem><FormLabel>Horas</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="minutos" render={({ field }) => (
                <FormItem><FormLabel>Minutos</FormLabel><FormControl><Input type="number" min={0} max={59} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="data" render={({ field }) => (
                <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="motivo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{motivos.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observacoes" render={({ field }) => (
              <FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

