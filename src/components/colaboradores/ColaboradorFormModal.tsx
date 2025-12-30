import { memo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Pencil, Loader2 } from 'lucide-react';
import { Colaborador } from '@/types/colaborador';
import { validateCPF } from '@/lib/masks';

const colaboradorSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf: z.string()
    .min(14, 'CPF deve estar completo')
    .refine((val) => validateCPF(val), {
      message: 'CPF inválido',
    }),
  matricula: z.string()
    .trim()
    .min(1, 'Matrícula é obrigatória')
    .max(20, 'Matrícula deve ter no máximo 20 caracteres'),
  cargo: z.string()
    .trim()
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(50, 'Cargo deve ter no máximo 50 caracteres'),
  departamento: z.string()
    .min(1, 'Selecione um departamento'),
  dataAdmissao: z.string()
    .min(1, 'Data de admissão é obrigatória'),
  salario: z.string()
    .min(1, 'Salário é obrigatório')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Salário deve ser um valor positivo',
    }),
  gestor: z.string()
    .trim()
    .max(100, 'Nome do gestor deve ter no máximo 100 caracteres')
    .optional(),
  status: z.enum(['ativo', 'admissao', 'ferias', 'afastado', 'desligado'], {
    required_error: 'Selecione um status',
  }),
});

export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

const departamentos = [
  'Gravação',
  'Artes',
  'Comercial',
  'Administrativo',
  'Logística',
  'Financeiro',
  'Produção',
];

const statusOptions = [
  { value: 'admissao', label: 'Em Admissão' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'ferias', label: 'Férias' },
  { value: 'afastado', label: 'Afastado' },
  { value: 'desligado', label: 'Desligado' },
];

interface ColaboradorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaborador?: Colaborador | null;
  onSuccess?: (data: ColaboradorFormData, isEdit: boolean) => void;
}

export const ColaboradorFormModal = memo(function ColaboradorFormModal({ open, onOpenChange, colaborador, onSuccess }: ColaboradorFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!colaborador;

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      matricula: '',
      cargo: '',
      departamento: '',
      dataAdmissao: '',
      salario: '',
      gestor: '',
      status: 'admissao',
    },
  });

  // Preencher form quando editar
  useEffect(() => {
    if (colaborador && open) {
      // Map from Colaborador type (which uses data_admissao, cargo object, etc.)
      const cargoNome = typeof colaborador.cargo === 'object' && colaborador.cargo 
        ? (colaborador.cargo as { nome?: string }).nome ?? '' 
        : String(colaborador.cargo ?? '');
      const deptNome = typeof colaborador.departamento === 'object' && colaborador.departamento 
        ? (colaborador.departamento as { nome?: string }).nome ?? '' 
        : String(colaborador.departamento ?? '');
      
      // Map status to valid form status
      const statusMap: Record<string, 'ativo' | 'admissao' | 'ferias' | 'afastado' | 'desligado'> = {
        'ativo': 'ativo',
        'inativo': 'desligado',
        'ferias': 'ferias',
        'afastado': 'afastado',
        'desligado': 'desligado',
        'pendente': 'admissao',
        'admissao': 'admissao',
      };

      form.reset({
        nome: colaborador.nome ?? '',
        cpf: colaborador.cpf ?? '',
        matricula: (colaborador as unknown as Record<string, unknown>).matricula as string ?? '',
        cargo: cargoNome,
        departamento: deptNome,
        dataAdmissao: colaborador.data_admissao ?? '',
        salario: String(colaborador.salario ?? 0),
        gestor: (colaborador as unknown as Record<string, unknown>).gestor as string ?? '',
        status: statusMap[colaborador.status] ?? 'admissao',
      });
    } else if (!open) {
      form.reset({
        nome: '',
        cpf: '',
        matricula: '',
        cargo: '',
        departamento: '',
        dataAdmissao: '',
        salario: '',
        gestor: '',
        status: 'admissao',
      });
    }
  }, [colaborador, open, form]);

  const onSubmit = async (data: ColaboradorFormData) => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    toast({
      title: isEditMode ? 'Colaborador atualizado!' : 'Colaborador cadastrado!',
      description: `${data.nome} foi ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
    
    onSuccess?.(data, isEditMode);
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {isEditMode ? (
              <Pencil className="w-5 h-5 text-primary" />
            ) : (
              <UserPlus className="w-5 h-5 text-primary" />
            )}
            {isEditMode ? 'Editar Colaborador' : 'Novo Colaborador'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Atualize os dados do colaborador abaixo.'
              : 'Preencha os dados abaixo para cadastrar um novo colaborador.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: João Silva Santos" 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <MaskedInput 
                      mask="cpf"
                      value={field.value}
                      onValueChange={(_, maskedValue) => field.onChange(maskedValue)}
                      className="bg-background font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Matrícula e Data Admissão */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 001-2025" 
                        {...field} 
                        className="bg-background font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataAdmissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Admissão *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cargo e Departamento */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Analista de RH" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border border-border z-50">
                        {departamentos.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salário e Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário (R$) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 3500.00" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border border-border z-50">
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gestor */}
            <FormField
              control={form.control}
              name="gestor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gestor Responsável</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Carlos Mendes" 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleClose(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    {isEditMode ? <Pencil className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {isEditMode ? 'Salvar' : 'Cadastrar'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
