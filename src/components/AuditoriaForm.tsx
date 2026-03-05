// V14-022: AuditoriaForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker as DatePickerWithRange } from "@/components/ui/date-range-picker";

const auditoriaSchema = z.object({
  tipo: z.string().min(1, "Selecione o tipo"),
  modulo: z.string().min(1, "Selecione o módulo"),
  usuarioId: z.string().optional(),
  dataInicio: z.string().min(1, "Data inicial obrigatória"),
  dataFim: z.string().min(1, "Data final obrigatória"),
  descricao: z.string().optional(),
});

type AuditoriaFormData = z.infer<typeof auditoriaSchema>;

interface AuditoriaFormProps {
  onSubmit: (data: AuditoriaFormData) => void;
  onCancel: () => void;
  usuarios: Array<{ id: string; nome: string }>;
}

const tiposAuditoria = [
  { value: "acesso", label: "Acesso ao Sistema" },
  { value: "alteracao", label: "Alteração de Dados" },
  { value: "exclusao", label: "Exclusão de Dados" },
  { value: "exportacao", label: "Exportação de Dados" },
  { value: "importacao", label: "Importação de Dados" },
];

const modulos = [
  { value: "colaboradores", label: "Colaboradores" },
  { value: "folha", label: "Folha de Pagamento" },
  { value: "ferias", label: "Férias" },
  { value: "ponto", label: "Ponto" },
  { value: "beneficios", label: "Benefícios" },
  { value: "documentos", label: "Documentos" },
  { value: "configuracoes", label: "Configurações" },
];

export function AuditoriaForm({ onSubmit, onCancel, usuarios }: AuditoriaFormProps) {
  const form = useForm<AuditoriaFormData>({
    resolver: zodResolver(auditoriaSchema),
    defaultValues: {},
  });

  return (
    <Card>
      <CardHeader><CardTitle>Filtros de Auditoria</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ação</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger></FormControl>
                    <SelectContent>{tiposAuditoria.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="modulo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger></FormControl>
                    <SelectContent>{modulos.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="usuarioId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger></FormControl>
                    <SelectContent>{usuarios.map((u) => (<SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dataInicio" render={({ field }) => (
                <FormItem><FormLabel>Data Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dataFim" render={({ field }) => (
                <FormItem><FormLabel>Data Fim</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Limpar</Button>
              <Button type="submit">Buscar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

