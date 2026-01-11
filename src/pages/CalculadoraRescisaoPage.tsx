// V15-337
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormSelect } from '@/components/forms';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
export default function CalculadoraRescisaoPage() {
  const [salario, setSalario] = useState(0); const [tipo, setTipo] = useState('sem_justa_causa');
  const [resultado, setResultado] = useState<any>(null);
  const tiposRescisao = [{ value: 'sem_justa_causa', label: 'Sem Justa Causa' }, { value: 'pedido_demissao', label: 'Pedido de Demissão' }, { value: 'justa_causa', label: 'Justa Causa' }];
  const calcular = () => {
    const saldo = (salario / 30) * 15; const ferias = salario + salario / 3; const decimo = (salario / 12) * 6;
    const aviso = tipo === 'sem_justa_causa' ? salario : 0; const multa = tipo === 'sem_justa_causa' ? salario * 0.4 : 0;
    setResultado({ saldo, ferias, decimo, aviso, multa, total: saldo + ferias + decimo + aviso + multa });
  };
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Calculadora de Rescisão">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Dados</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">Último Salário</label><CurrencyInput value={salario} onChange={setSalario} /></div>
          <FormSelect label="Tipo de Rescisão" options={tiposRescisao} value={tipo} onChange={setTipo} />
          <FormField label="Data Admissão" type="date" /><FormField label="Data Rescisão" type="date" />
          <Button onClick={calcular} className="w-full"><Calculator className="h-4 w-4 mr-2" />Calcular</Button>
        </CardContent></Card>
        {resultado && (
          <Card><CardHeader><CardTitle>Resultado</CardTitle></CardHeader><CardContent className="space-y-3">
            <div className="flex justify-between"><span>Saldo de Salário</span><span>{fmt(resultado.saldo)}</span></div>
            <div className="flex justify-between"><span>Férias + 1/3</span><span>{fmt(resultado.ferias)}</span></div>
            <div className="flex justify-between"><span>13º Proporcional</span><span>{fmt(resultado.decimo)}</span></div>
            {resultado.aviso > 0 && <div className="flex justify-between"><span>Aviso Prévio</span><span>{fmt(resultado.aviso)}</span></div>}
            {resultado.multa > 0 && <div className="flex justify-between"><span>Multa FGTS (40%)</span><span>{fmt(resultado.multa)}</span></div>}
            <div className="border-t pt-4 flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-600">{fmt(resultado.total)}</span></div>
          </CardContent></Card>
        )}
      </div>
    </PageLayout>
  );
}
