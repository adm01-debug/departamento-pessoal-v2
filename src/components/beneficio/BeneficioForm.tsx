// V15-262: src/components/beneficio/BeneficioForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { FormSection, FormActions } from '@/components/forms/FormSection';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  nome: z.string().min(2),
  tipo: z.string(),
  valor_empresa: z.number().min(0),
  valor_colaborador: z.number().min(0),
  tipo_desconto: z.string(),
  fornecedor: z.string().optional(),
  ativo: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface BeneficioFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const tipoOptions = [
  { value: 'vale_transporte', label: 'Vale Transporte' },
  { value: 'vale_refeicao', label: 'Vale Refeição' },
  { value: 'vale_alimentacao', label: 'Vale Alimentação' },
  { value: 'plano_saude', label: 'Plano de Saúde' },
  { value: 'plano_odontologico', label: 'Plano Odontológico' },
  { value: 'seguro_vida', label: 'Seguro de Vida' },
  { value: 'outros', label: 'Outros' },
];

const descontoOptions = [
  { value: 'percentual', label: 'Percentual' },
  { value: 'fixo', label: 'Valor Fixo' },
  { value: 'sem_desconto', label: 'Sem Desconto' },
];

export function BeneficioForm({ initialData, onSubmit, onCancel, loading }: BeneficioFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Informações do Benefício">
        <FormField label="Nome" {...register('nome')} error={errors.nome?.message} />
        <FormSelect label="Tipo" options={tipoOptions} value={watch('tipo')} onChange={(v) => setValue('tipo', v)} />
        <div className="space-y-2"><label className="text-sm font-medium">Valor Empresa</label><CurrencyInput value={watch('valor_empresa')} onChange={(v) => setValue('valor_empresa', v)} /></div>
        <div className="space-y-2"><label className="text-sm font-medium">Valor Colaborador</label><CurrencyInput value={watch('valor_colaborador')} onChange={(v) => setValue('valor_colaborador', v)} /></div>
        <FormSelect label="Tipo de Desconto" options={descontoOptions} value={watch('tipo_desconto')} onChange={(v) => setValue('tipo_desconto', v)} />
        <FormField label="Fornecedor" {...register('fornecedor')} />
      </FormSection>
      <FormSwitch label="Ativo" checked={watch('ativo')} onCheckedChange={(c) => setValue('ativo', c)} />
      <FormActions>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
      </FormActions>
    </form>
  );
}
