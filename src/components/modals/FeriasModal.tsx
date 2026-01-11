// V15-417
import { FormModal } from '@/modals/FormModal';
import { FormField, FormCheckbox } from '@/components/forms';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { useState } from 'react';
interface FeriasModalProps { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: any) => Promise<void>; colaboradorNome: string; diasDisponiveis: number; }
export function FeriasModal({ open, onOpenChange, onSubmit, colaboradorNome, diasDisponiveis }: FeriasModalProps) {
  const [dataInicio, setDataInicio] = useState<Date>(); const [dataFim, setDataFim] = useState<Date>(); const [abono, setAbono] = useState(false); const [diasAbono, setDiasAbono] = useState(0); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ data_inicio: dataInicio, data_fim: dataFim, abono_pecuniario: abono, dias_abono: diasAbono }); onOpenChange(false); } finally { setLoading(false); } };
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title="Solicitar Férias" description={`Colaborador: ${colaboradorNome} - ${diasDisponiveis} dias disponíveis`} onSubmit={handleSubmit} loading={loading} submitText="Solicitar">
      <div className="space-y-4"><FormDatePicker label="Data Início" value={dataInicio} onChange={(d) => setDataInicio(d!)} /><FormDatePicker label="Data Fim" value={dataFim} onChange={(d) => setDataFim(d!)} /><FormCheckbox label="Abono Pecuniário" description="Vender até 1/3 das férias" checked={abono} onCheckedChange={setAbono} />{abono && <FormField label="Dias de Abono" type="number" value={diasAbono} onChange={(e) => setDiasAbono(parseInt(e.target.value))} />}</div>
    </FormModal>
  );
}
