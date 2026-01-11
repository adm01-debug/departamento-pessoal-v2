// V15-418
import { FormModal } from '@/modals/FormModal';
import { FormField } from '@/components/forms';
import { useState } from 'react';
interface DepartamentoModalProps { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: any) => Promise<void>; initialData?: any; }
export function DepartamentoModal({ open, onOpenChange, onSubmit, initialData }: DepartamentoModalProps) {
  const [nome, setNome] = useState(initialData?.nome || ''); const [sigla, setSigla] = useState(initialData?.sigla || ''); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, sigla }); onOpenChange(false); } finally { setLoading(false); } };
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar Departamento' : 'Novo Departamento'} onSubmit={handleSubmit} loading={loading}>
      <div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><FormField label="Sigla" value={sigla} onChange={(e) => setSigla(e.target.value)} maxLength={10} /></div>
    </FormModal>
  );
}
