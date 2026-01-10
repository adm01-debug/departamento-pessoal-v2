// V14-023: CargoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const cargoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cbo: z.string().min(6, "CBO obrigatório").max(6),
  descricao: z.string().optional(),
  departamentoId: z.string().min(1, "Departamento obrigatório"),
  nivelHierarquico: z.enum(["operacional", "tecnico", "supervisao", "gerencia", "diretoria"]),
  salarioBase: z.number().min(0, "Salário inválido"),
  cargaHorariaSemanal: z.number().min(1).max(44),
});

type CargoFormData = z.infer<typeof cargoSchema>;

interface CargoFormProps {
  defaultValues?: Partial<CargoFormData>;
  departamentos: Array<{ id: string; nome: string }>;
  onSubmit: (data: CargoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CargoForm({ defaultValues, departamentos, onSubmit, onCancel, isLoading }: CargoFormProps) {
  const form = useForm<CargoFormData>({
    resolver: zodResolver(cargoSchema),
    defaultValues: {
      nome: "",
      cbo: "",
      descricao: "",
      departamentoId: "",
      nivelHierarquico: "operacional",
      salarioBase: 0,
      cargaHorariaSemanal: 44,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Analista de Sistemas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cbo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CBO</FormLabel>
                <FormControl>
                  <Input placeholder="212205" maxLength={6} {...field} />
                </FormControl>
                <FormDescription>Código Brasileiro de Ocupações</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departamentoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departamentos.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.nome}
                      </SelectItem>
                    ))}
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
            name="nivelHierarquico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível Hierárquico</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="supervisao">Supervisão</SelectItem>
                    <SelectItem value="gerencia">Gerência</SelectItem>
                    <SelectItem value="diretoria">Diretoria</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salarioBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salário Base (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cargaHorariaSemanal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carga Horária Semanal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={44}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 44)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Cargo</FormLabel>
              <FormControl>
                <Textarea placeholder="Atribuições e responsabilidades..." {...field} />
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

