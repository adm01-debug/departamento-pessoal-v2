// V14-029: ConfigForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const configSchema = z.object({
  nomeEmpresa: z.string().min(2, "Nome obrigatório"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 dígitos"),
  emailNotificacoes: z.string().email("Email inválido"),
  fusoHorario: z.string(),
  formatoData: z.enum(["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"]),
  notificacoesEmail: z.boolean(),
  notificacoesPush: z.boolean(),
  backupAutomatico: z.boolean(),
  retencaoDados: z.number().min(1).max(120),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface ConfigFormProps {
  defaultValues?: Partial<ConfigFormData>;
  onSubmit: (data: ConfigFormData) => void;
  isLoading?: boolean;
}

export function ConfigForm({ defaultValues, onSubmit, isLoading }: ConfigFormProps) {
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      nomeEmpresa: "", cnpj: "", emailNotificacoes: "", fusoHorario: "America/Sao_Paulo",
      formatoData: "dd/MM/yyyy", notificacoesEmail: true, notificacoesPush: false,
      backupAutomatico: true, retencaoDados: 60, ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Dados da Empresa</CardTitle><CardDescription>Informações básicas</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="nomeEmpresa" render={({ field }) => (
                <FormItem><FormLabel>Nome da Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cnpj" render={({ field }) => (
                <FormItem><FormLabel>CNPJ</FormLabel><FormControl><Input maxLength={14} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notificações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="emailNotificacoes" render={({ field }) => (
              <FormItem><FormLabel>Email para Notificações</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="notificacoesEmail" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div><FormLabel>Notificações por Email</FormLabel><FormDescription>Receber alertas por email</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="notificacoesPush" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div><FormLabel>Notificações Push</FormLabel><FormDescription>Receber alertas no navegador</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sistema</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="backupAutomatico" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div><FormLabel>Backup Automático</FormLabel><FormDescription>Realizar backup diário</FormDescription></div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar Configurações"}</Button>
        </div>
      </form>
    </Form>
  );
}

