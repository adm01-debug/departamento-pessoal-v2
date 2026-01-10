// V14-033: DepartamentoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const departamentoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  sigla: z.string().max(10).optional(),
  responsavelId: z.string().optional(),
  centroCusto: z.string().optional(),
  descricao: z.string().optional(),
});

type DepartamentoFormData = z.infer<typeof departamentoSchema>;

interface DepartamentoFormProps {
  defaultValues?: Partial<DepartamentoFormData>;
  responsaveis: Array<{ id: string; nome: string }>;
  onSubmit: (data: DepartamentoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DepartamentoForm({ defaultValues, responsaveis, onSubmit, onCancel, isLoading }: DepartamentoFormProps) {
  const form = useForm<DepartamentoFormData>({
    resolver: zodResolver(departamentoSchema),
    defaultValues: { nome: "", sigla: "", responsavelId: "", centroCusto: "", descricao: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Recursos Humanos" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="sigla" render={({ field }) => (
            <FormItem><FormLabel>Sigla</FormLabel><FormControl><Input placeholder="RH" maxLength={10} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="responsavelId" render={({ field }) => (
            <FormItem><FormLabel>Responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{responsaveis.map((r) => <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>)}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="centroCusto" render={({ field }) => (
            <FormItem><FormLabel>Centro de Custo</FormLabel><FormControl><Input placeholder="001" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Descrição..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

