import { PageTitle } from '@/components/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
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
  nome_completo: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().length(11, 'CPF inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_admissao: z.string().min(1, 'Data obrigatória'),
  data_nascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  salario_base: z.number().positive('Salário deve ser positivo'),
  cargo: z.string().min(1, 'Cargo obrigatório'),
  departamento: z.string().min(1, 'Departamento obrigatório'),
  sexo: z.enum(['masculino', 'feminino']),
  estado_civil: z.enum(['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel']).default('solteiro'),
  tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario', 'autonomo']).default('clt'),
  nome_mae: z.string().min(1, 'Nome da mãe obrigatório'),
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

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'ativo', estado_civil: 'solteiro', tipo_contrato: 'clt' },
  });

  // Populate form when editing
  useEffect(() => {
    if (colaborador) {
      reset({
        nome_completo: colaborador.nome_completo,
        cpf: colaborador.cpf,
        email: colaborador.email || '',
        telefone: colaborador.telefone || '',
        data_admissao: colaborador.data_admissao,
        data_nascimento: colaborador.data_nascimento,
        salario_base: colaborador.salario_base,
        cargo: colaborador.cargo,
        departamento: colaborador.departamento,
        sexo: colaborador.sexo as any,
        estado_civil: colaborador.estado_civil as any,
        tipo_contrato: colaborador.tipo_contrato as any,
        nome_mae: colaborador.nome_mae,
        status: colaborador.status,
      });
    }
  }, [colaborador, reset]);

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

  const sexoOptions = [{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }];
  const estadoCivilOptions = [
    { value: 'solteiro', label: 'Solteiro(a)' }, { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' }, { value: 'viuvo', label: 'Viúvo(a)' },
    { value: 'uniao_estavel', label: 'União Estável' },
  ];
  const contratoOptions = [
    { value: 'clt', label: 'CLT' }, { value: 'pj', label: 'PJ' },
    { value: 'estagio', label: 'Estágio' }, { value: 'temporario', label: 'Temporário' },
  ];

  return (
    <>
    <PageTitle title="Cadastro de Colaborador" description="Formulário de colaborador" />
    <PageLayout title={isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
        <FormSection title="Dados Pessoais">
          <FormField label="Nome Completo" {...register('nome_completo')} error={errors.nome_completo?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">CPF</label><CPFInput onChange={(v) => setValue('cpf', v)} /></div>
          <FormField label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">Telefone</label><PhoneInput onChange={(v) => setValue('telefone', v)} /></div>
          <FormField label="Data Nascimento" type="date" {...register('data_nascimento')} error={errors.data_nascimento?.message} />
          <FormField label="Nome da Mãe" {...register('nome_mae')} error={errors.nome_mae?.message} />
          <FormSelect label="Sexo" options={sexoOptions} onChange={(v) => setValue('sexo', v as any)} error={errors.sexo?.message} />
          <FormSelect label="Estado Civil" options={estadoCivilOptions} onChange={(v) => setValue('estado_civil', v as any)} error={errors.estado_civil?.message} />
        </FormSection>
        <FormSection title="Dados Profissionais">
          <FormField label="Data Admissão" type="date" {...register('data_admissao')} error={errors.data_admissao?.message} />
          <div className="space-y-2"><label className="text-sm font-medium">Salário Base</label><CurrencyInput onChange={(v) => setValue('salario_base', v)} /></div>
          <FormField label="Cargo" {...register('cargo')} error={errors.cargo?.message} />
          <FormField label="Departamento" {...register('departamento')} error={errors.departamento?.message} />
          <FormSelect label="Tipo Contrato" options={contratoOptions} onChange={(v) => setValue('tipo_contrato', v as any)} error={errors.tipo_contrato?.message} />
        </FormSection>
        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
        </FormActions>
      </form>
    </PageLayout>
    </>
  );
}
