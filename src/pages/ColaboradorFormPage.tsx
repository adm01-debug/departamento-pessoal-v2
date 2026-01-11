// V15-223: src/pages/ColaboradorFormPage.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageLayout } from '@/components/layout';
import { FormField, FormSelect } from '@/components/forms';
import { FormSection, FormActions } from '@/components/forms/FormSection';
import { CPFInput } from '@/components/ui/cpf-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { colaboradorService } from '@/services';
import { useNotification } from '@/contexts';

const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().length(11, 'CPF inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_admissao: z.string().min(1, 'Data obrigatória'),
  salario: z.number().positive('Salário deve ser positivo'),
  cargo: z.string().optional(),
  status: z.string().default('ativo'),
});

type FormData = z.infer<typeof schema>;

export default function ColaboradorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useNotification();
  const isEditing = !!id;

  const { data: colaborador, isLoading } = useQuery({
    queryKey: ['colaborador', id],
    queryFn: () => colaboradorService.getById(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: colaborador || { status: 'ativo' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => isEditing ? colaboradorService.update(id!, data as any) : colaboradorService.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      success(isEditing ? 'Colaborador atualizado!' : 'Colaborador criado!');
      navigate('/colaboradores');
    },
    onError: (err: any) => error('Erro', err.message),
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;

  return (
    <PageLayout title={isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <FormSection title="Dados Pessoais">
          <FormField label="Nome" {...register('nome')} error={errors.nome?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">CPF</label><CPFInput onChange={(v) => setValue('cpf', v)} /></div>
          <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">Telefone</label><PhoneInput onChange={(v) => setValue('telefone', v)} /></div>
        </FormSection>
        <FormSection title="Dados Profissionais">
          <FormField label="Data Admissão" type="date" {...register('data_admissao')} error={errors.data_admissao?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">Salário</label><CurrencyInput onChange={(v) => setValue('salario', v)} /></div>
          <FormField label="Cargo" {...register('cargo')} />
        </FormSection>
        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
        </FormActions>
      </form>
    </PageLayout>
  );
}
