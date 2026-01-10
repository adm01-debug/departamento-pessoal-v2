// V14-050: PontoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const pontoSchema = z.object({
  colaboradorId: z.string().min(1, "Colaborador obrigatório"),
  data: z.string().min(1, "Data obrigatória"),
  entrada1: z.string().optional(),
  saida1: z.string().optional(),
  entrada2: z.string().optional(),
  saida2: z.string().optional(),
  tipo: z.enum(["normal", "hora_extra", "falta", "atestado", "ferias", "folga"]),
  observacao: z.string().optional(),
});

type PontoFormData = z.infer<typeof pontoSchema>;

interface PontoFormProps {
  defaultValues?: Partial<PontoFormData>;
  colaboradores: Array<{ id: string; nome: string }>;
  onSubmit: (data: PontoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function PontoForm({ defaultValues, colaboradores, onSubmit, onCancel, isLoading }: PontoFormProps) {
  const form = useForm<PontoFormData>({
    resolver: zodResolver(pontoSchema),
    defaultValues: {
      colaboradorId: "", data: "", entrada1: "", saida1: "", entrada2: "", saida2: "", tipo: "normal", observacao: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="colaboradorId" render={({ field }) => (
            <FormItem><FormLabel>Colaborador</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{colaboradores.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="data" render={({ field }) => (
            <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem><FormLabel>Tipo de Registro</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hora_extra">Hora Extra</SelectItem>
                <SelectItem value="falta">Falta</SelectItem>
                <SelectItem value="atestado">Atestado</SelectItem>
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="folga">Folga</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-4 gap-4">
          <FormField control={form.control} name="entrada1" render={({ field }) => (
            <FormItem><FormLabel>Entrada 1</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="saida1" render={({ field }) => (
            <FormItem><FormLabel>Saída 1</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="entrada2" render={({ field }) => (
            <FormItem><FormLabel>Entrada 2</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="saida2" render={({ field }) => (
            <FormItem><FormLabel>Saída 2</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="observacao" render={({ field }) => (
          <FormItem><FormLabel>Observação</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

