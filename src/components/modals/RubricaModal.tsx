// V15-423
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { useState } from 'react';
const tipoOptions = [{ value: 'provento', label: 'Provento' }, { value: 'desconto', label: 'Desconto' }, { value: 'informativo', label: 'Informativo' }];
export function RubricaModal({ open, onOpenChange, onSubmit, initialData }: any) {
  const [codigo, setCodigo] = useState(initialData?.codigo || ''); const [nome, setNome] = useState(initialData?.nome || ''); const [tipo, setTipo] = useState(initialData?.tipo || 'provento'); const [incideInss, setIncideInss] = useState(true); const [incideFgts, setIncideFgts] = useState(true); const [incideIrrf, setIncideIrrf] = useState(true); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ codigo, nome, tipo, incide_inss: incideInss, incide_fgts: incideFgts, incide_irrf: incideIrrf }); onOpenChange(false); } finally { setLoading(false); } };
  return (<FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar Rubrica' : 'Nova Rubrica'} onSubmit={handleSubmit} loading={loading}><div className="space-y-4"><div className="grid grid-cols-3 gap-4"><FormField label="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} /><div className="col-span-2"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /></div></div><FormSelect label="Tipo" options={tipoOptions} value={tipo} onChange={setTipo} /><div className="space-y-2"><p className="text-sm font-medium">Incidências</p><FormSwitch label="INSS" checked={incideInss} onCheckedChange={setIncideInss} /><FormSwitch label="FGTS" checked={incideFgts} onCheckedChange={setIncideFgts} /><FormSwitch label="IRRF" checked={incideIrrf} onCheckedChange={setIncideIrrf} /></div></div></FormModal>);
}
