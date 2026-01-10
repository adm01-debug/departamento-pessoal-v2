// V14-021: BeneficioForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const beneficioSchema = z.object({
  tipo: z.enum(["vale_transporte", "vale_refeicao", "vale_alimentacao", "plano_saude", "plano_odonto", "seguro_vida", "outro"]),
  descricao: z.string().min(3, "Descrição obrigatória"),
  valorEmpresa: z.number().min(0, "Valor inválido"),
  valorColaborador: z.number().min(0, "Valor inválido"),
  ativo: z.boolean(),
  observacoes: z.string().optional(),
});

type BeneficioFormData = z.infer<typeof beneficioSchema>;

interface BeneficioFormProps {
  defaultValues?: Partial<BeneficioFormData>;
  onSubmit: (data: BeneficioFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BeneficioForm({ defaultValues, onSubmit, onCancel, isLoading }: BeneficioFormProps) {
  const form = useForm<BeneficioFormData>({
    resolver: zodResolver(beneficioSchema),
    defaultValues: {
      tipo: "vale_transporte",
      descricao: "",
      valorEmpresa: 0,
      valorColaborador: 0,
      ativo: true,
      observacoes: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Benefício</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vale_transporte">Vale Transporte</SelectItem>
                  <SelectItem value="vale_refeicao">Vale Refeição</SelectItem>
                  <SelectItem value="vale_alimentacao">Vale Alimentação</SelectItem>
                  <SelectItem value="plano_saude">Plano de Saúde</SelectItem>
                  <SelectItem value="plano_odonto">Plano Odontológico</SelectItem>
                  <SelectItem value="seguro_vida">Seguro de Vida</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição do benefício" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valorEmpresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Empresa (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Custo para a empresa</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valorColaborador"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto Colaborador (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Desconto em folha</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Benefício Ativo</FormLabel>
                <FormDescription>Disponível para atribuição</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea placeholder="Observações adicionais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

