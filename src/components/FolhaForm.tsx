// V14-045: FolhaForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const folhaSchema = z.object({
  competencia: z.string().min(7, "Competência obrigatória"),
  tipo: z.enum(["mensal", "adiantamento", "ferias", "13_primeira", "13_segunda", "rescisao"]),
  empresaId: z.string().min(1, "Empresa obrigatória"),
  dataCalculo: z.string().min(1, "Data obrigatória"),
  dataPagamento: z.string().min(1, "Data obrigatória"),
});

type FolhaFormData = z.infer<typeof folhaSchema>;

interface FolhaFormProps {
  defaultValues?: Partial<FolhaFormData>;
  empresas: Array<{ id: string; nome: string }>;
  onSubmit: (data: FolhaFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FolhaForm({ defaultValues, empresas, onSubmit, onCancel, isLoading }: FolhaFormProps) {
  const form = useForm<FolhaFormData>({
    resolver: zodResolver(folhaSchema),
    defaultValues: { competencia: "", tipo: "mensal", empresaId: "", dataCalculo: "", dataPagamento: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="competencia" render={({ field }) => (
            <FormItem><FormLabel>Competência</FormLabel><FormControl><Input type="month" {...field} /></FormControl><FormDescription>Mês/Ano de referência</FormDescription><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem><FormLabel>Tipo de Folha</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="adiantamento">Adiantamento</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="13_primeira">13º - 1ª Parcela</SelectItem>
                  <SelectItem value="13_segunda">13º - 2ª Parcela</SelectItem>
                  <SelectItem value="rescisao">Rescisão</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="empresaId" render={({ field }) => (
          <FormItem><FormLabel>Empresa</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
              <SelectContent>{empresas.map((e) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="dataCalculo" render={({ field }) => (
            <FormItem><FormLabel>Data de Cálculo</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="dataPagamento" render={({ field }) => (
            <FormItem><FormLabel>Data de Pagamento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Processando..." : "Gerar Folha"}</Button>
        </div>
      </form>
    </Form>
  );
}

