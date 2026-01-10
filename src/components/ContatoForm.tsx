// V14-030: ContatoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const contatoSchema = z.object({
  tipo: z.enum(["telefone", "celular", "email", "whatsapp", "outro"]),
  valor: z.string().min(1, "Valor obrigatório"),
  principal: z.boolean(),
  observacao: z.string().optional(),
});

type ContatoFormData = z.infer<typeof contatoSchema>;

interface ContatoFormProps {
  defaultValues?: Partial<ContatoFormData>;
  onSubmit: (data: ContatoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ContatoForm({ defaultValues, onSubmit, onCancel, isLoading }: ContatoFormProps) {
  const form = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
    defaultValues: { tipo: "celular", valor: "", principal: false, observacao: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem><FormLabel>Tipo de Contato</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="telefone">Telefone Fixo</SelectItem>
                <SelectItem value="celular">Celular</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="valor" render={({ field }) => (
          <FormItem><FormLabel>Contato</FormLabel><FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="observacao" render={({ field }) => (
          <FormItem><FormLabel>Observação</FormLabel><FormControl><Input placeholder="Recado, horário..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

