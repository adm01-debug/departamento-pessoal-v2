// V14-037: DocumentoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

const documentoSchema = z.object({
  tipo: z.enum(["contrato", "aditivo", "atestado", "certificado", "declaracao", "recibo", "outro"]),
  titulo: z.string().min(2, "Título obrigatório"),
  descricao: z.string().optional(),
  dataEmissao: z.string().optional(),
  dataValidade: z.string().optional(),
});

type DocumentoFormData = z.infer<typeof documentoSchema>;

interface DocumentoFormProps {
  defaultValues?: Partial<DocumentoFormData>;
  onSubmit: (data: DocumentoFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DocumentoForm({ defaultValues, onSubmit, onCancel, isLoading }: DocumentoFormProps) {
  const form = useForm<DocumentoFormData>({
    resolver: zodResolver(documentoSchema),
    defaultValues: { tipo: "contrato", titulo: "", descricao: "", dataEmissao: "", dataValidade: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem><FormLabel>Tipo de Documento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="aditivo">Aditivo</SelectItem>
                <SelectItem value="atestado">Atestado</SelectItem>
                <SelectItem value="certificado">Certificado</SelectItem>
                <SelectItem value="declaracao">Declaração</SelectItem>
                <SelectItem value="recibo">Recibo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="titulo" render={({ field }) => (
          <FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Nome do documento" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="dataEmissao" render={({ field }) => (
            <FormItem><FormLabel>Data Emissão</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="dataValidade" render={({ field }) => (
            <FormItem><FormLabel>Data Validade</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Observações..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para selecionar</p>
          <Input type="file" className="mt-2" accept=".pdf,.doc,.docx,.jpg,.png" />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

