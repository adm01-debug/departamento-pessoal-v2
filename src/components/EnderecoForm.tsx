// V14-042: EnderecoForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const enderecoSchema = z.object({
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  logradouro: z.string().min(2, "Logradouro obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "UF obrigatória"),
  tipo: z.enum(["residencial", "comercial", "correspondencia"]),
});

type EnderecoFormData = z.infer<typeof enderecoSchema>;

interface EnderecoFormProps {
  defaultValues?: Partial<EnderecoFormData>;
  onSubmit: (data: EnderecoFormData) => void;
  onCancel?: () => void;
  onSearchCep?: (cep: string) => void;
  isLoading?: boolean;
}

const estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

export function EnderecoForm({ defaultValues, onSubmit, onCancel, onSearchCep, isLoading }: EnderecoFormProps) {
  const form = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", tipo: "residencial", ...defaultValues },
  });

  const handleSearchCep = () => {
    const cep = form.getValues("cep");
    if (cep && cep.length === 8) onSearchCep?.(cep);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="cep" render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <div className="flex gap-2">
                <FormControl><Input placeholder="00000000" maxLength={8} {...field} /></FormControl>
                <Button type="button" variant="outline" size="icon" onClick={handleSearchCep}><Search className="h-4 w-4" /></Button>
              </div>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="tipo" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="correspondencia">Correspondência</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <FormField control={form.control} name="logradouro" render={({ field }) => (
            <FormItem className="col-span-3"><FormLabel>Logradouro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="numero" render={({ field }) => (
            <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="complemento" render={({ field }) => (
            <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input placeholder="Apto, Bloco..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bairro" render={({ field }) => (
            <FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="cidade" render={({ field }) => (
            <FormItem className="col-span-2"><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="estado" render={({ field }) => (
            <FormItem><FormLabel>UF</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                <SelectContent>{estados.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
        </div>
      </form>
    </Form>
  );
}

