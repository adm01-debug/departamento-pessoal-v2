// V14-040: EmpresaForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const empresaSchema = z.object({
  razaoSocial: z.string().min(2, "Razão social obrigatória"),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().length(14, "CNPJ deve ter 14 dígitos"),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  ativa: z.boolean(),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  defaultValues?: Partial<EmpresaFormData>;
  onSubmit: (data: EmpresaFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function EmpresaForm({ defaultValues, onSubmit, onCancel, isLoading }: EmpresaFormProps) {
  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      razaoSocial: "", nomeFantasia: "", cnpj: "", inscricaoEstadual: "", inscricaoMunicipal: "",
      email: "", telefone: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "", ativa: true,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="dados">Dados</TabsTrigger><TabsTrigger value="endereco">Endereço</TabsTrigger></TabsList>
          <TabsContent value="dados" className="space-y-4">
            <FormField control={form.control} name="razaoSocial" render={({ field }) => (
              <FormItem><FormLabel>Razão Social</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="nomeFantasia" render={({ field }) => (
                <FormItem><FormLabel>Nome Fantasia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cnpj" render={({ field }) => (
                <FormItem><FormLabel>CNPJ</FormLabel><FormControl><Input maxLength={14} {...field} /></FormControl><FormMessage /></FormItem>
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
            <FormField control={form.control} name="ativa" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div><FormLabel>Empresa Ativa</FormLabel><FormDescription>Disponível para operações</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </TabsContent>
          <TabsContent value="endereco" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="cep" render={({ field }) => (
                <FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="logradouro" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Logradouro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <FormField control={form.control} name="numero" render={({ field }) => (
                <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bairro" render={({ field }) => (
                <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cidade" render={({ field }) => (
                <FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="estado" render={({ field }) => (
                <FormItem><FormLabel>UF</FormLabel><FormControl><Input maxLength={2} {...field} /></FormControl><FormMessage /></FormItem>
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

