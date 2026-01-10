// V14-020: BancoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bancoSchema = z.object({
  codigo: z.string().min(3, "Código obrigatório").max(3),
  nome: z.string().min(2, "Nome obrigatório"),
  agencia: z.string().min(4, "Agência obrigatória"),
  digitoAgencia: z.string().optional(),
  conta: z.string().min(5, "Conta obrigatória"),
  digitoConta: z.string().min(1, "Dígito obrigatório"),
  tipoConta: z.enum(["corrente", "poupanca", "salario"]),
});

type BancoFormData = z.infer<typeof bancoSchema>;

interface BancoFormProps {
  defaultValues?: Partial<BancoFormData>;
  onSubmit: (data: BancoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BancoForm({ defaultValues, onSubmit, onCancel, isLoading }: BancoFormProps) {
  const form = useForm<BancoFormData>({
    resolver: zodResolver(bancoSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      agencia: "",
      digitoAgencia: "",
      conta: "",
      digitoConta: "",
      tipoConta: "corrente",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Banco</FormLabel>
                <FormControl>
                  <Input placeholder="001" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Banco</FormLabel>
                <FormControl>
                  <Input placeholder="Banco do Brasil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="agencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agência</FormLabel>
                <FormControl>
                  <Input placeholder="0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="digitoAgencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dígito Ag.</FormLabel>
                <FormControl>
                  <Input placeholder="X" maxLength={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoConta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Conta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                    <SelectItem value="salario">Conta Salário</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="conta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conta</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="digitoConta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dígito</FormLabel>
                <FormControl>
                  <Input placeholder="0" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

