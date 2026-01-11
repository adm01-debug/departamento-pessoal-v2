// V15-421
import { FormModal } from '@/modals/FormModal';
import { FormField, FormSelect, FormSwitch } from '@/components/forms';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useState } from 'react';
const tipoOptions = [{ value: 'vale_transporte', label: 'Vale Transporte' }, { value: 'vale_refeicao', label: 'Vale Refeição' }, { value: 'plano_saude', label: 'Plano de Saúde' }, { value: 'outros', label: 'Outros' }];
export function BeneficioModal({ open, onOpenChange, onSubmit, initialData }: any) {
  const [nome, setNome] = useState(initialData?.nome || ''); const [tipo, setTipo] = useState(initialData?.tipo || ''); const [valorEmpresa, setValorEmpresa] = useState(0); const [valorColab, setValorColab] = useState(0); const [ativo, setAtivo] = useState(true); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => { setLoading(true); try { await onSubmit({ nome, tipo, valor_empresa: valorEmpresa, valor_colaborador: valorColab, ativo }); onOpenChange(false); } finally { setLoading(false); } };
  return (<FormModal open={open} onOpenChange={onOpenChange} title={initialData ? 'Editar' : 'Novo'} onSubmit={handleSubmit} loading={loading}><div className="space-y-4"><FormField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><FormSelect label="Tipo" options={tipoOptions} value={tipo} onChange={setTipo} /><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-sm font-medium">Valor Empresa</label><CurrencyInput value={valorEmpresa} onChange={setValorEmpresa} /></div><div className="space-y-2"><label className="text-sm font-medium">Desconto</label><CurrencyInput value={valorColab} onChange={setValorColab} /></div></div><FormSwitch label="Ativo" checked={ativo} onCheckedChange={setAtivo} /></div></FormModal>);
}
