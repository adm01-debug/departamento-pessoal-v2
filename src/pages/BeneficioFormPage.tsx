import { PageTitle } from '@/components/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { PageLayout } from '@/components/layout';
import { FormField } from '@/components/forms';
import { FormSection, FormActions } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BeneficioFormData {
  colaborador_id: string;
  tipo_beneficio_id: string;
  valor: string;
  desconto: string;
  data_inicio: string;
  observacoes: string;
}

export default function BeneficioFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm<BeneficioFormData>();

  const { data: tipos } = useQuery({
    queryKey: ['tipos_beneficio'],
    queryFn: async () => {
      const { data } = await supabase.from('tipos_beneficio').select('*').eq('ativo', true);
      return data || [];
    },
  });

  const { data: colaboradores } = useQuery({
    queryKey: ['colaboradores_ativos'],
    queryFn: async () => {
      const { data } = await supabase.from('colaboradores').select('id, nome_completo').eq('status', 'ativo');
      return data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: BeneficioFormData) => {
      const { error } = await supabase.from('beneficios_colaborador').insert({
        colaborador_id: formData.colaborador_id,
        tipo_beneficio_id: formData.tipo_beneficio_id,
        valor: parseFloat(formData.valor) || 0,
        desconto: parseFloat(formData.desconto) || 0,
        data_inicio: formData.data_inicio,
        observacoes: formData.observacoes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios'] });
      toast.success('Benefício cadastrado com sucesso!');
      navigate('/beneficios');
    },
    onError: (err: Error) => toast.error(`Erro ao cadastrar: ${err.message}`),
  });

  return (
    <>
    <PageTitle title="Novo Benefício" description="Cadastro de benefício" />
    <PageLayout title="Novo Benefício">
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <FormSection title="Dados do Benefício">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Colaborador</label>
              <select {...register('colaborador_id', { required: true })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione...</option>
                {colaboradores?.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome_completo}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Benefício</label>
              <select {...register('tipo_beneficio_id', { required: true })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione...</option>
                {tipos?.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
            <FormField label="Valor (R$)" type="number" step="0.01" {...register('valor')} />
            <FormField label="Desconto (R$)" type="number" step="0.01" {...register('desconto')} />
            <FormField label="Data Início" type="date" {...register('data_inicio', { required: true })} />
            <FormField label="Observações" {...register('observacoes')} />
          </div>
        </FormSection>
        <FormActions>
          <Button type="button" variant="outline" onClick={() => navigate('/beneficios')}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Salvando...' : 'Salvar'}</Button>
        </FormActions>
      </form>
    </PageLayout>
    </>
  );
}
