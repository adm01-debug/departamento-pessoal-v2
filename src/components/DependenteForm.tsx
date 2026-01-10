// V14-035: DependenteForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const dependenteSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  dataNascimento: z.string().min(1, "Data obrigatória"),
  parentesco: z.enum(["conjuge", "filho", "enteado", "pai", "mae", "outro"]),
  irrf: z.boolean(),
  salarioFamilia: z.boolean(),
  planoSaude: z.boolean(),
});

type DependenteFormData = z.infer<typeof dependenteSchema>;

interface DependenteFormProps {
  defaultValues?: Partial<DependenteFormData>;
  onSubmit: (data: DependenteFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DependenteForm({ defaultValues, onSubmit, onCancel, isLoading }: DependenteFormProps) {
  const form = useForm<DependenteFormData>({
    resolver: zodResolver(dependenteSchema),
    defaultValues: {
      nome: "", cpf: "", dataNascimento: "", parentesco: "filho",
      irrf: true, salarioFamilia: false, planoSaude: false, ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="cpf" render={({ field }) => (
            <FormItem><FormLabel>CPF</FormLabel><FormControl><Input maxLength={11} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="dataNascimento" render={({ field }) => (
            <FormItem><FormLabel>Data Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="parentesco" render={({ field }) => (
          <FormItem><FormLabel>Grau de Parentesco</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="conjuge">Cônjuge</SelectItem>
                <SelectItem value="filho">Filho(a)</SelectItem>
                <SelectItem value="enteado">Enteado(a)</SelectItem>
                <SelectItem value="pai">Pai</SelectItem>
                <SelectItem value="mae">Mãe</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <div className="space-y-4">
          <FormField control={form.control} name="irrf" render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div><FormLabel>Dedução IRRF</FormLabel><FormDescription>Incluir na dedução do IR</FormDescription></div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="salarioFamilia" render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div><FormLabel>Salário Família</FormLabel><FormDescription>Elegível para salário família</FormDescription></div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="planoSaude" render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div><FormLabel>Plano de Saúde</FormLabel><FormDescription>Incluir no plano</FormDescription></div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
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

