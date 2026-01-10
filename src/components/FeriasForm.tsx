// V14-043: FeriasForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const feriasSchema = z.object({
  colaboradorId: z.string().min(1, "Colaborador obrigatório"),
  periodoAquisitivoInicio: z.string().min(1, "Data obrigatória"),
  periodoAquisitivoFim: z.string().min(1, "Data obrigatória"),
  dataInicio: z.string().min(1, "Data obrigatória"),
  dataFim: z.string().min(1, "Data obrigatória"),
  diasGozo: z.number().min(5).max(30),
  abonoPecuniario: z.boolean(),
  diasAbono: z.number().min(0).max(10),
  adiantamento13: z.boolean(),
});

type FeriasFormData = z.infer<typeof feriasSchema>;

interface FeriasFormProps {
  defaultValues?: Partial<FeriasFormData>;
  colaboradores: Array<{ id: string; nome: string }>;
  onSubmit: (data: FeriasFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FeriasForm({ defaultValues, colaboradores, onSubmit, onCancel, isLoading }: FeriasFormProps) {
  const form = useForm<FeriasFormData>({
    resolver: zodResolver(feriasSchema),
    defaultValues: {
      colaboradorId: "", periodoAquisitivoInicio: "", periodoAquisitivoFim: "",
      dataInicio: "", dataFim: "", diasGozo: 30, abonoPecuniario: false, diasAbono: 0, adiantamento13: false,
      ...defaultValues,
    },
  });

  const abonoPecuniario = form.watch("abonoPecuniario");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="colaboradorId" render={({ field }) => (
          <FormItem><FormLabel>Colaborador</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
              <SelectContent>{colaboradores.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Período Aquisitivo</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="periodoAquisitivoInicio" render={({ field }) => (
              <FormItem><FormLabel>Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="periodoAquisitivoFim" render={({ field }) => (
              <FormItem><FormLabel>Fim</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Período de Gozo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="dataInicio" render={({ field }) => (
                <FormItem><FormLabel>Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dataFim" render={({ field }) => (
                <FormItem><FormLabel>Fim</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="diasGozo" render={({ field }) => (
                <FormItem><FormLabel>Dias</FormLabel><FormControl>
                  <Input type="number" min={5} max={30} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 30)} />
                </FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </CardContent>
        </Card>
        <FormField control={form.control} name="abonoPecuniario" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div><FormLabel>Abono Pecuniário</FormLabel><FormDescription>Vender até 1/3 das férias</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        {abonoPecuniario && (
          <FormField control={form.control} name="diasAbono" render={({ field }) => (
            <FormItem><FormLabel>Dias de Abono</FormLabel><FormControl>
              <Input type="number" min={0} max={10} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
            </FormControl><FormMessage /></FormItem>
          )} />
        )}
        <FormField control={form.control} name="adiantamento13" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div><FormLabel>Adiantamento 13º</FormLabel><FormDescription>Receber 1ª parcela junto às férias</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

