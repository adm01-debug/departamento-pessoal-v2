// V14-052: RelatorioForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileText, Download } from "lucide-react";

const relatorioSchema = z.object({
  tipo: z.enum(["folha", "colaboradores", "ferias", "ponto", "beneficios", "encargos", "analitico"]),
  formato: z.enum(["pdf", "excel", "csv"]),
  dataInicio: z.string().min(1, "Data obrigatória"),
  dataFim: z.string().min(1, "Data obrigatória"),
  empresaId: z.string().optional(),
  departamentoId: z.string().optional(),
  incluirInativos: z.boolean(),
  agruparPor: z.enum(["colaborador", "departamento", "cargo", "nenhum"]),
});

type RelatorioFormData = z.infer<typeof relatorioSchema>;

interface RelatorioFormProps {
  empresas?: Array<{ id: string; nome: string }>;
  departamentos?: Array<{ id: string; nome: string }>;
  onSubmit: (data: RelatorioFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RelatorioForm({ empresas, departamentos, onSubmit, onCancel, isLoading }: RelatorioFormProps) {
  const form = useForm<RelatorioFormData>({
    resolver: zodResolver(relatorioSchema),
    defaultValues: {
      tipo: "folha", formato: "pdf", dataInicio: "", dataFim: "", empresaId: "", departamentoId: "",
      incluirInativos: false, agruparPor: "colaborador",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem><FormLabel>Tipo de Relatório</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="folha">Folha de Pagamento</SelectItem>
                  <SelectItem value="colaboradores">Colaboradores</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="ponto">Ponto</SelectItem>
                  <SelectItem value="beneficios">Benefícios</SelectItem>
                  <SelectItem value="encargos">Encargos</SelectItem>
                  <SelectItem value="analitico">Analítico</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="formato" render={({ field }) => (
            <FormItem><FormLabel>Formato</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="dataInicio" render={({ field }) => (
            <FormItem><FormLabel>Data Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="dataFim" render={({ field }) => (
            <FormItem><FormLabel>Data Fim</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="agruparPor" render={({ field }) => (
          <FormItem><FormLabel>Agrupar Por</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="colaborador">Colaborador</SelectItem>
                <SelectItem value="departamento">Departamento</SelectItem>
                <SelectItem value="cargo">Cargo</SelectItem>
                <SelectItem value="nenhum">Sem Agrupamento</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="incluirInativos" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div><FormLabel>Incluir Inativos</FormLabel><FormDescription>Mostrar colaboradores desligados</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Gerando..." : <><Download className="mr-2 h-4 w-4" />Gerar Relatório</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}

