import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, FormCheckbox } from '@/components/forms';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { FormActions } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';

const schema = z.object({
  data_inicio: z.date({ message: 'Data obrigatória' }),
  data_fim: z.date({ message: 'Data obrigatória' }),
  abono_pecuniario: z.boolean().default(false),
  dias_abono: z.number().min(0).max(10).optional(),
  adiantamento_13: z.boolean().default(false),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface FeriasSolicitacaoFormProps {
  diasDisponiveis: number;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function FeriasSolicitacaoForm({ diasDisponiveis, onSubmit, onCancel, loading }: FeriasSolicitacaoFormProps) {
  const { handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  
  const dataInicio = watch('data_inicio');
  const dataFim = watch('data_fim');
  const abono = watch('abono_pecuniario');
  const diasSolicitados = dataInicio && dataFim ? differenceInDays(dataFim, dataInicio) + 1 : 0;

  return (
    <Card>
      <CardHeader><CardTitle>Solicitar Férias</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormDatePicker label="Data Início" value={dataInicio} onChange={(d) => setValue('data_inicio', d!)} error={errors.data_inicio?.message} />
            <FormDatePicker label="Data Fim" value={dataFim} onChange={(d) => setValue('data_fim', d!)} error={errors.data_fim?.message} />
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">Dias solicitados: <strong>{diasSolicitados}</strong></p>
            <p className="text-sm">Dias disponíveis: <strong>{diasDisponiveis}</strong></p>
          </div>
          <FormCheckbox label="Abono Pecuniário" description="Vender até 1/3 das férias" checked={abono} onCheckedChange={(c) => setValue('abono_pecuniario', c)} />
          {abono && <FormField label="Dias de Abono" type="number" onChange={(e) => setValue('dias_abono', parseInt(e.target.value))} />}
          <FormCheckbox label="Adiantamento 13º" description="Receber 50% do 13º junto com as férias" checked={watch('adiantamento_13')} onCheckedChange={(c) => setValue('adiantamento_13', c)} />
          <FormActions>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar'}</Button>
          </FormActions>
        </form>
      </CardContent>
    </Card>
  );
}
