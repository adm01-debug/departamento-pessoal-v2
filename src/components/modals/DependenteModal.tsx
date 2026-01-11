// V15-424
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { CPFInput } from '@/components/ui/cpf-input';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { useState } from 'react';
const parentescoOptions = [{ value: 'filho', label: 'Filho(a)' }, { value: 'conjuge', label: 'Cônjuge' }, { value: 'pai', label: 'Pai' }, { value: 'mae', label: 'Mãe' }, { value: 'outro', label: 'Outro' }];
export function DependenteModal({ open, onOpenChange, onSubmit, initialData }: any) {
  const [nome, setNome] = useState(''); const [parentesco, setParentesco] = useState(''); const [nascimento, setNascimento] = useState<Date>(); const [cpf, setCpf] = useState(''); const [irDeducao, setIrDeducao] = useState(true); const [salFamilia, setSalFamilia] = useState(false); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, parentesco, data_nascimento: nascimento, cpf, ir_deducao: irDeducao, salario_familia: salFamilia }); onOpenChange(false); } finally { setLoading(false); } };
  return (<FormModal open={open} onOpenChange={onOpenChange} title="Adicionar Dependente" onSubmit={handleSubmit} loading={loading}><div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><FormSelect label="Parentesco" options={parentescoOptions} value={parentesco} onChange={setParentesco} /><FormDatePicker label="Data Nascimento" value={nascimento} onChange={(d) => setNascimento(d!)} /><div className="space-y-2"><label className="text-sm font-medium">CPF</label><CPFInput onChange={setCpf} /></div><FormSwitch label="Dedução IR" checked={irDeducao} onCheckedChange={setIrDeducao} /><FormSwitch label="Salário Família" checked={salFamilia} onCheckedChange={setSalFamilia} /></div></FormModal>);
}
