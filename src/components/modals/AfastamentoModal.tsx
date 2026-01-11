// V15-425
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect, FormTextarea } from '@/components/forms';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { useState } from 'react';
const tipoOptions = [{ value: 'doenca', label: 'Doença' }, { value: 'acidente_trabalho', label: 'Acidente de Trabalho' }, { value: 'licenca_maternidade', label: 'Licença Maternidade' }, { value: 'licenca_paternidade', label: 'Licença Paternidade' }, { value: 'outros', label: 'Outros' }];
export function AfastamentoModal({ open, onOpenChange, onSubmit, colaboradorId }: any) {
  const [tipo, setTipo] = useState(''); const [dataInicio, setDataInicio] = useState<Date>(); const [dataFim, setDataFim] = useState<Date>(); const [cid, setCid] = useState(''); const [motivo, setMotivo] = useState(''); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ colaborador_id: colaboradorId, tipo, data_inicio: dataInicio, data_fim: dataFim, cid, motivo }); onOpenChange(false); } finally { setLoading(false); } };
  return (<FormModal open={open} onOpenChange={onOpenChange} title="Novo Afastamento" onSubmit={handleSubmit} loading={loading}><div className="space-y-4"><FormSelect label="Tipo" options={tipoOptions} value={tipo} onChange={setTipo} /><div className="grid grid-cols-2 gap-4"><FormDatePicker label="Data Início" value={dataInicio} onChange={(d) => setDataInicio(d!)} /><FormDatePicker label="Data Fim" value={dataFim} onChange={(d) => setDataFim(d!)} /></div><FormField label="CID" value={cid} onChange={(e) => setCid(e.target.value)} placeholder="Ex: J11" /><FormTextarea label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} /></div></FormModal>);
}
