// V14-024: BackupForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const backupSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo"),
  destino: z.string().min(1, "Selecione o destino"),
  compressao: z.boolean().default(true),
  criptografia: z.boolean().default(true),
  agendamento: z.string().optional(),
  retencaoDias: z.coerce.number().min(1).max(365).default(30),
  notificarEmail: z.boolean().default(true),
  email: z.string().email().optional(),
});

type BackupFormData = z.infer<typeof backupSchema>;

interface BackupFormProps {
  initialData?: Partial<BackupFormData>;
  onSubmit: (data: BackupFormData) => void;
  onCancel: () => void;
}

const tiposBackup = [
  { value: "completo", label: "Backup Completo" },
  { value: "incremental", label: "Backup Incremental" },
  { value: "diferencial", label: "Backup Diferencial" },
];

const destinosBackup = [
  { value: "local", label: "Armazenamento Local" },
  { value: "s3", label: "Amazon S3" },
  { value: "gcs", label: "Google Cloud Storage" },
  { value: "azure", label: "Azure Blob Storage" },
];

export function BackupForm({ initialData, onSubmit, onCancel }: BackupFormProps) {
  const form = useForm<BackupFormData>({
    resolver: zodResolver(backupSchema),
    defaultValues: initialData || { compressao: true, criptografia: true, retencaoDias: 30, notificarEmail: true },
  });

  return (
    <Card>
      <CardHeader><CardTitle>{initialData ? "Editar Backup" : "Novo Backup"}</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem><FormLabel>Nome do Backup</FormLabel><FormControl><Input placeholder="Ex: Backup Diário" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{tiposBackup.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="destino" render={({ field }) => (
                <FormItem>
                  <FormLabel>Destino</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                    <SelectContent>{destinosBackup.map((d) => (<SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="retencaoDias" render={({ field }) => (
                <FormItem><FormLabel>Retenção (dias)</FormLabel><FormControl><Input type="number" min={1} max={365} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="compressao" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div><FormLabel>Compressão</FormLabel><FormDescription>Compactar backup</FormDescription></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="criptografia" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div><FormLabel>Criptografia</FormLabel><FormDescription>Criptografar dados</FormDescription></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="notificarEmail" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div><FormLabel>Notificar</FormLabel><FormDescription>Enviar email</FormDescription></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
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

