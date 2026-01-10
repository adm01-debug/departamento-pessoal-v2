// V14-027: ColaboradorForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const colaboradorSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  rg: z.string().optional(),
  dataNascimento: z.string().min(1, "Data obrigatória"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cargoId: z.string().min(1, "Cargo obrigatório"),
  departamentoId: z.string().min(1, "Departamento obrigatório"),
  dataAdmissao: z.string().min(1, "Data obrigatória"),
  salario: z.number().min(0, "Salário inválido"),
});

type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

interface ColaboradorFormProps {
  defaultValues?: Partial<ColaboradorFormData>;
  cargos: Array<{ id: string; nome: string }>;
  departamentos: Array<{ id: string; nome: string }>;
  onSubmit: (data: ColaboradorFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ColaboradorForm({ defaultValues, cargos, departamentos, onSubmit, onCancel, isLoading }: ColaboradorFormProps) {
  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome: "", cpf: "", rg: "", dataNascimento: "", email: "", telefone: "",
      cargoId: "", departamentoId: "", dataAdmissao: "", salario: 0,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="pessoal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="profissional">Profissional</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoal" className="space-y-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Nome" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="cpf" render={({ field }) => (
                <FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="00000000000" maxLength={11} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                <FormItem><FormLabel>Data Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="telefone" render={({ field }) => (
                <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </TabsContent>

          <TabsContent value="profissional" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="cargoId" render={({ field }) => (
                <FormItem><FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{cargos.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="departamentoId" render={({ field }) => (
                <FormItem><FormLabel>Departamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{departamentos.map((d) => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}</SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dataAdmissao" render={({ field }) => (
                <FormItem><FormLabel>Data Admissão</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="salario" render={({ field }) => (
                <FormItem><FormLabel>Salário (R$)</FormLabel><FormControl>
                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                </FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

