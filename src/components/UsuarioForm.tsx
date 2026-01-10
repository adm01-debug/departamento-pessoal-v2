// V14-054: UsuarioForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const usuarioSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres").optional(),
  perfil: z.enum(["admin", "gestor", "rh", "colaborador"]),
  empresaId: z.string().optional(),
  ativo: z.boolean(),
  permissoes: z.array(z.string()),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  defaultValues?: Partial<UsuarioFormData>;
  empresas?: Array<{ id: string; nome: string }>;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const permissoesDisponiveis = [
  { id: "colaboradores", label: "Colaboradores" },
  { id: "folha", label: "Folha de Pagamento" },
  { id: "ferias", label: "Férias" },
  { id: "ponto", label: "Ponto" },
  { id: "relatorios", label: "Relatórios" },
  { id: "configuracoes", label: "Configurações" },
];

export function UsuarioForm({ defaultValues, empresas, onSubmit, onCancel, isLoading, isEdit }: UsuarioFormProps) {
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { nome: "", email: "", senha: "", perfil: "colaborador", empresaId: "", ativo: true, permissoes: [], ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="senha" render={({ field }) => (
            <FormItem><FormLabel>{isEdit ? "Nova Senha (opcional)" : "Senha"}</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="perfil" render={({ field }) => (
            <FormItem><FormLabel>Perfil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                </SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
          {empresas && (
            <FormField control={form.control} name="empresaId" render={({ field }) => (
              <FormItem><FormLabel>Empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger></FormControl>
                  <SelectContent>{empresas.map((e) => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}</SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
          )}
        </div>
        <FormField control={form.control} name="permissoes" render={() => (
          <FormItem>
            <FormLabel>Permissões</FormLabel>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {permissoesDisponiveis.map((p) => (
                <FormField key={p.id} control={form.control} name="permissoes" render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value?.includes(p.id)} onCheckedChange={(checked) => {
                        const value = field.value || [];
                        field.onChange(checked ? [...value, p.id] : value.filter((v) => v !== p.id));
                      }} />
                    </FormControl>
                    <FormLabel className="font-normal">{p.label}</FormLabel>
                  </FormItem>
                )} />
              ))}
            </div>
          </FormItem>
        )} />
        <FormField control={form.control} name="ativo" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div><FormLabel>Usuário Ativo</FormLabel><FormDescription>Permitir acesso ao sistema</FormDescription></div>
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

