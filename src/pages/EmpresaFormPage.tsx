// V15-414
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout';
import { FormField, FormSelect } from '@/components/forms';
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
  const { id } = useParams(); const navigate = useNavigate(); const qc = useQueryClient(); const { success, error } = useNotification();
  const isEditing = !!id;
  const { data: empresa, isLoading } = useQuery({ queryKey: ['empresa', id], queryFn: () => empresaService.buscarPorId(id!), enabled: isEditing });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EmpresaSchema>({ resolver: zodResolver(empresaSchema), defaultValues: empresa });
  const mutation = useMutation({
    mutationFn: (data: EmpresaSchema) => isEditing ? empresaService.atualizar(id!, data as any) : empresaService.criar(data as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['empresas'] }); success(isEditing ? 'Empresa atualizada!' : 'Empresa criada!'); navigate('/empresas'); },
    onError: (err: any) => error('Erro', err.message),
  });
  if (isLoading) return <Spinner size="lg" />;
  const regimeOptions = [{ value: 'simples_nacional', label: 'Simples Nacional' }, { value: 'lucro_presumido', label: 'Lucro Presumido' }, { value: 'lucro_real', label: 'Lucro Real' }];
  return (
    <PageLayout title={isEditing ? 'Editar Empresa' : 'Nova Empresa'}>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <FormSection title="Dados da Empresa"><FormField label="Razão Social" {...register('razao_social')} error={errors.razao_social?.message} /><FormField label="Nome Fantasia" {...register('nome_fantasia')} /><div className="space-y-2"><label className="text-sm font-medium">CNPJ</label><CNPJInput onChange={(v) => setValue('cnpj', v)} /></div><FormField label="Inscrição Estadual" {...register('inscricao_estadual')} /><FormSelect label="Regime Tributário" options={regimeOptions} value={watch('regime_tributario')} onChange={(v) => setValue('regime_tributario', v as any)} /></FormSection>
        <FormSection title="Contato"><FormField label="Email" type="email" {...register('email')} /><div className="space-y-2"><label className="text-sm font-medium">Telefone</label><PhoneInput onChange={(v) => setValue('telefone', v)} /></div></FormSection>
        <FormSection title="Endereço"><div className="space-y-2"><label className="text-sm font-medium">CEP</label><CEPInput onChange={(v) => setValue('cep', v)} /></div><FormField label="Logradouro" {...register('logradouro')} /><FormField label="Número" {...register('numero')} /><FormField label="Bairro" {...register('bairro')} /><FormField label="Cidade" {...register('cidade')} /><FormField label="UF" {...register('uf')} maxLength={2} /></FormSection>
        <FormActions><Button type="button" variant="outline" onClick={() => navigate('/empresas')}>Cancelar</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Salvando...' : 'Salvar'}</Button></FormActions>
      </form>
    </PageLayout>
  );
}
