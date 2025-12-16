import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';
import { useState } from 'react';

const colaboradorSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
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
  status: z.enum(['ativo', 'admissao'], {
    required_error: 'Selecione um status',
  }),
});

type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

const departamentos = [
  'Gravação',
  'Artes',
  'Comercial',
  'Administrativo',
  'Logística',
  'Financeiro',
  'Produção',
];

interface NovoColaboradorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: ColaboradorFormData) => void;
}

export function NovoColaboradorModal({ open, onOpenChange, onSuccess }: NovoColaboradorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome: '',
      matricula: '',
      cargo: '',
      departamento: '',
      dataAdmissao: '',
      salario: '',
      gestor: '',
      status: 'admissao',
    },
  });

  const onSubmit = async (data: ColaboradorFormData) => {
    setIsSubmitting(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: 'Colaborador cadastrado!',
      description: `${data.nome} foi adicionado com sucesso.`,
    });
    
    onSuccess?.(data);
    form.reset();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      if (!open) {
        form.reset();
      }
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="w-5 h-5 text-primary" />
            Novo Colaborador
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo colaborador.
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
                        <SelectItem value="admissao">Em Admissão</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
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
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
