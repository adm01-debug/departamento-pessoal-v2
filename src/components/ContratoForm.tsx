// V14-031: ContratoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const contratoSchema = z.object({
  tipo: z.enum(["clt", "pj", "estagio", "temporario", "intermitente"]),
  dataInicio: z.string().min(1, "Data obrigatória"),
  dataFim: z.string().optional(),
  prazoIndeterminado: z.boolean(),
  salario: z.number().min(0),
  cargaHoraria: z.number().min(1).max(44),
  periodoExperiencia: z.number().optional(),
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface ContratoFormProps {
  defaultValues?: Partial<ContratoFormData>;
  onSubmit: (data: ContratoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ContratoForm({ defaultValues, onSubmit, onCancel, isLoading }: ContratoFormProps) {
  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      tipo: "clt", dataInicio: "", dataFim: "", prazoIndeterminado: true,
      salario: 0, cargaHoraria: 44, periodoExperiencia: 90, ...defaultValues,
    },
  });

  const prazoIndeterminado = form.watch("prazoIndeterminado");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem><FormLabel>Tipo de Contrato</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="clt">CLT</SelectItem>
                <SelectItem value="pj">PJ</SelectItem>
                <SelectItem value="estagio">Estágio</SelectItem>
                <SelectItem value="temporario">Temporário</SelectItem>
                <SelectItem value="intermitente">Intermitente</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="dataInicio" render={({ field }) => (
            <FormItem><FormLabel>Data Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          {!prazoIndeterminado && (
            <FormField control={form.control} name="dataFim" render={({ field }) => (
              <FormItem><FormLabel>Data Fim</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          )}
        </div>
        <FormField control={form.control} name="prazoIndeterminado" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div><FormLabel>Prazo Indeterminado</FormLabel><FormDescription>Contrato sem data de término</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="salario" render={({ field }) => (
            <FormItem><FormLabel>Salário (R$)</FormLabel><FormControl>
              <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
            </FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="cargaHoraria" render={({ field }) => (
            <FormItem><FormLabel>Carga Horária Semanal</FormLabel><FormControl>
              <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 44)} />
            </FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

