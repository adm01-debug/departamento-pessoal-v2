// V15-422
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect } from '@/components/forms';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { useState } from 'react';
const tipoOptions = [{ value: 'nacional', label: 'Nacional' }, { value: 'estadual', label: 'Estadual' }, { value: 'municipal', label: 'Municipal' }];
export function FeriadoModal({ open, onOpenChange, onSubmit, initialData }: any) {
  const [nome, setNome] = useState(initialData?.nome || ''); const [data, setData] = useState<Date>(); const [tipo, setTipo] = useState(initialData?.tipo || 'nacional'); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, data, tipo }); onOpenChange(false); } finally { setLoading(false); } };
  return (<FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar Feriado' : 'Novo Feriado'} onSubmit={handleSubmit} loading={loading}><div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><FormDatePicker label="Data" value={data} onChange={(d) => setData(d!)} /><FormSelect label="Tipo" options={tipoOptions} value={tipo} onChange={setTipo} /></div></FormModal>);
}
