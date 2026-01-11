// V15-419
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect } from '@/components/forms';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useState } from 'react';
interface CargoModalProps { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: any) => Promise<void>; initialData?: any; }
const nivelOptions = [{ value: 'junior', label: 'Júnior' }, { value: 'pleno', label: 'Pleno' }, { value: 'senior', label: 'Sênior' }, { value: 'especialista', label: 'Especialista' }];
export function CargoModal({ open, onOpenChange, onSubmit, initialData }: CargoModalProps) {
  const [nome, setNome] = useState(initialData?.nome || ''); const [cbo, setCbo] = useState(initialData?.cbo || ''); const [nivel, setNivel] = useState(initialData?.nivel || ''); const [salarioMin, setSalarioMin] = useState(initialData?.salario_min || 0); const [salarioMax, setSalarioMax] = useState(initialData?.salario_max || 0); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, cbo, nivel, salario_min: salarioMin, salario_max: salarioMax }); onOpenChange(false); } finally { setLoading(false); } };
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar Cargo' : 'Novo Cargo'} onSubmit={handleSubmit} loading={loading}>
      <div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><FormField label="CBO" value={cbo} onChange={(e) => setCbo(e.target.value)} placeholder="Ex: 2124-05" /><FormSelect label="Nível" options={nivelOptions} value={nivel} onChange={setNivel} /><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Salário Mínimo</label><CurrencyInput value={salarioMin} onChange={setSalarioMin} /></div><div className="space-y-2"><label className="text-sm font-medium">Salário Máximo</label><CurrencyInput value={salarioMax} onChange={setSalarioMax} /></div></div></div>
    </FormModal>
  );
}
