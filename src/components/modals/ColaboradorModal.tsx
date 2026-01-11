// V15-416
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect } from '@/components/forms';
import { CPFInput } from '@/components/ui/cpf-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useState } from 'react';
interface ColaboradorModalProps { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: any) => Promise<void>; initialData?: any; }
export function ColaboradorModal({ open, onOpenChange, onSubmit, initialData }: ColaboradorModalProps) {
  const [nome, setNome] = useState(initialData?.nome || ''); const [cpf, setCpf] = useState(''); const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState(''); const [salario, setSalario] = useState(0); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, cpf, email, telefone, salario }); onOpenChange(false); } finally { setLoading(false); } };
  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar Colaborador' : 'Novo Colaborador'} onSubmit={handleSubmit} loading={loading}>
      <div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><div className="space-y-2"><label className="text-sm font-medium">CPF</label><CPFInput onChange={setCpf} /></div><FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><div className="space-y-2"><label className="text-sm font-medium">Telefone</label><PhoneInput onChange={setTelefone} /></div><div className="space-y-2"><label className="text-sm font-medium">Salário</label><CurrencyInput value={salario} onChange={setSalario} /></div></div>
    </FormModal>
  );
}
