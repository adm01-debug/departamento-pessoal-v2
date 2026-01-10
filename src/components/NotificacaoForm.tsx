// V14-047: NotificacaoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const notificacaoSchema = z.object({
  tipo: z.enum(["info", "alerta", "erro", "sucesso"]),
  titulo: z.string().min(2, "Título obrigatório"),
  mensagem: z.string().min(5, "Mensagem obrigatória"),
  destinatarios: z.enum(["todos", "gestores", "rh", "colaborador"]),
  colaboradorId: z.string().optional(),
});

type NotificacaoFormData = z.infer<typeof notificacaoSchema>;

interface NotificacaoFormProps {
  defaultValues?: Partial<NotificacaoFormData>;
  colaboradores?: Array<{ id: string; nome: string }>;
  onSubmit: (data: NotificacaoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function NotificacaoForm({ defaultValues, colaboradores, onSubmit, onCancel, isLoading }: NotificacaoFormProps) {
  const form = useForm<NotificacaoFormData>({
    resolver: zodResolver(notificacaoSchema),
    defaultValues: { tipo: "info", titulo: "", mensagem: "", destinatarios: "todos", colaboradorId: "", ...defaultValues },
  });

  const destinatarios = form.watch("destinatarios");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem><FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="info">Informativo</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                  <SelectItem value="sucesso">Sucesso</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="destinatarios" render={({ field }) => (
            <FormItem><FormLabel>Destinatários</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="gestores">Gestores</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="colaborador">Colaborador Específico</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        {destinatarios === "colaborador" && colaboradores && (
          <FormField control={form.control} name="colaboradorId" render={({ field }) => (
            <FormItem><FormLabel>Colaborador</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                <SelectContent>{colaboradores.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        )}
        <FormField control={form.control} name="titulo" render={({ field }) => (
          <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="mensagem" render={({ field }) => (
          <FormItem><FormLabel>Mensagem</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Enviando..." : "Enviar"}</Button>
        </div>
      </form>
    </Form>
  );
}

