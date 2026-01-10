// V14-020: AfastamentoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const afastamentoSchema = z.object({
  colaboradorId: z.string().min(1, "Selecione o colaborador"),
  tipoAfastamento: z.string().min(1, "Selecione o tipo"),
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFim: z.string().optional(),
  motivo: z.string().min(1, "Motivo obrigatório"),
  cid: z.string().optional(),
  documentoAnexo: z.string().optional(),
  observacoes: z.string().optional(),
});

type AfastamentoFormData = z.infer<typeof afastamentoSchema>;

interface AfastamentoFormProps {
  initialData?: Partial<AfastamentoFormData>;
  onSubmit: (data: AfastamentoFormData) => void;
  onCancel: () => void;
  colaboradores: Array<{ id: string; nome: string }>;
}

const tiposAfastamento = [
  { value: "doenca", label: "Doença" },
  { value: "acidente_trabalho", label: "Acidente de Trabalho" },
  { value: "licenca_maternidade", label: "Licença Maternidade" },
  { value: "licenca_paternidade", label: "Licença Paternidade" },
  { value: "licenca_casamento", label: "Licença Casamento" },
  { value: "licenca_obito", label: "Licença Óbito" },
  { value: "servico_militar", label: "Serviço Militar" },
  { value: "outros", label: "Outros" },
];

export function AfastamentoForm({ initialData, onSubmit, onCancel, colaboradores }: AfastamentoFormProps) {
  const form = useForm<AfastamentoFormData>({
    resolver: zodResolver(afastamentoSchema),
    defaultValues: initialData || {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Editar Afastamento" : "Novo Afastamento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="colaboradorId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Colaborador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {colaboradores.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tipoAfastamento" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Afastamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {tiposAfastamento.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dataInicio" render={({ field }) => (
                <FormItem><FormLabel>Data Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dataFim" render={({ field }) => (
                <FormItem><FormLabel>Data Fim (opcional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="motivo" render={({ field }) => (
                <FormItem><FormLabel>Motivo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cid" render={({ field }) => (
                <FormItem><FormLabel>CID (opcional)</FormLabel><FormControl><Input placeholder="Ex: J11" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="observacoes" render={({ field }) => (
              <FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

