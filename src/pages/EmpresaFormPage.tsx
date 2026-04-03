import { PageTitle } from '@/components/PageTitle';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout';
import { FormField } from '@/components/forms';
import { FormSection, FormActions } from '@/components/forms/FormSection';
import { CNPJInput } from '@/components/ui/cnpj-input';
import { CEPInput } from '@/components/ui/cep-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { empresaService } from '@/services';
import { empresaSchema, type EmpresaSchema } from '@/schemas';
import { useNotification } from '@/contexts';

export default function EmpresaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { success, error } = useNotification();
  const isEditing = !!id;

  const { data: empresa, isLoading } = useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresaService.buscarPorId(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<EmpresaSchema>({
    resolver: zodResolver(empresaSchema),
    defaultValues: { ativa: true },
  });

  useEffect(() => {
    if (empresa) {
      reset({
        razao_social: empresa.razao_social,
        nome_fantasia: empresa.nome_fantasia || '',
        cnpj: empresa.cnpj || '',
        inscricao_estadual: empresa.inscricao_estadual || '',
        email: empresa.email || '',
        telefone: empresa.telefone || '',
        cep: empresa.cep || '',
        logradouro: empresa.logradouro || '',
        numero: empresa.numero || '',
        bairro: empresa.bairro || '',
        cidade: empresa.cidade || '',
        uf: empresa.uf || '',
        ativa: empresa.ativa ?? true,
      });
    }
  }, [empresa, reset]);

  const mutation = useMutation({
    mutationFn: (data: EmpresaSchema) => isEditing ? empresaService.atualizar(id!, data as any) : empresaService.criar(data as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empresas'] });
      success(isEditing ? 'Empresa atualizada!' : 'Empresa criada!');
      navigate('/empresas');
    },
    onError: (err: any) => error('Erro', err.message),
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;

  return (
    <>
    <PageTitle title="Cadastro de Empresa" description="Formulário de empresa" />
    <PageLayout title={isEditing ? 'Editar Empresa' : 'Nova Empresa'}>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <FormSection title="Dados da Empresa">
          <div className="space-y-2">
            <label className="text-sm font-medium">CNPJ <span className="text-xs text-muted-foreground">(busca automática)</span></label>
            <CNPJInput
              onChange={(v) => setValue('cnpj', v)}
              onCompanyFound={(data) => {
                setValue('razao_social', data.razao_social);
                if (data.nome_fantasia) setValue('nome_fantasia', data.nome_fantasia);
                if (data.email) setValue('email', data.email);
                if (data.telefone) setValue('telefone', data.telefone);
                if (data.cep) setValue('cep', data.cep);
                if (data.logradouro) setValue('logradouro', data.logradouro);
                if (data.numero) setValue('numero', data.numero);
                if (data.bairro) setValue('bairro', data.bairro);
                if (data.municipio) setValue('cidade', data.municipio);
                if (data.uf) setValue('uf', data.uf);
              }}
            />
          </div>
          <FormField label="Razão Social" {...register('razao_social')} error={errors.razao_social?.message} />
          <FormField label="Nome Fantasia" {...register('nome_fantasia')} />
          <FormField label="Inscrição Estadual" {...register('inscricao_estadual')} />
        </FormSection>
        <FormSection title="Contato">
          <FormField label="Email" type="email" {...register('email')} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone</label>
            <PhoneInput onChange={(v) => setValue('telefone', v)} />
          </div>
        </FormSection>
        <FormSection title="Endereço">
          <div className="space-y-2">
            <label className="text-sm font-medium">CEP <span className="text-xs text-muted-foreground">(busca automática)</span></label>
            <CEPInput
              onChange={(v) => setValue('cep', v)}
              onAddressFound={(addr) => {
                setValue('logradouro', addr.logradouro);
                setValue('bairro', addr.bairro);
                setValue('cidade', addr.cidade);
                setValue('uf', addr.uf);
              }}
            />
          </div>
          <FormField label="Logradouro" {...register('logradouro')} />
          <FormField label="Número" {...register('numero')} />
          <FormField label="Bairro" {...register('bairro')} />
          <FormField label="Cidade" {...register('cidade')} />
          <FormField label="UF" {...register('uf')} maxLength={2} />
        </FormSection>
        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate('/empresas')}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
        </FormActions>
      </form>
    </PageLayout>
    </>
  );
}
