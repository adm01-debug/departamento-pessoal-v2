// V15-336
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { calcularFerias } from '@/calculators/ferias';
import { Calculator } from 'lucide-react';
export default function CalculadoraFeriasPage() {
  const [salario, setSalario] = useState(0); const [dias, setDias] = useState(30); const [abono, setAbono] = useState(0);
  const [resultado, setResultado] = useState<any>(null);
  const calcular = () => { setResultado(calcularFerias(salario, dias, abono)); };
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Calculadora de Férias">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Dados</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">Salário Base</label><CurrencyInput value={salario} onChange={setSalario} /></div>
          <FormField label="Dias de Gozo" type="number" value={dias} onChange={(e) => setDias(parseInt(e.target.value) || 30)} />
          <FormField label="Dias de Abono" type="number" value={abono} onChange={(e) => setAbono(parseInt(e.target.value) || 0)} />
          <Button onClick={calcular} className="w-full"><Calculator className="h-4 w-4 mr-2" />Calcular</Button>
        </CardContent></Card>
        {resultado && (
          <Card><CardHeader><CardTitle>Resultado</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex justify-between"><span>Valor Férias ({dias} dias)</span><span>{fmt(resultado.valorFerias)}</span></div>
            <div className="flex justify-between"><span>1/3 Constitucional</span><span>{fmt(resultado.tercoConstitucional)}</span></div>
            {abono > 0 && <><div className="flex justify-between"><span>Abono ({abono} dias)</span><span>{fmt(resultado.valorAbono)}</span></div><div className="flex justify-between"><span>1/3 sobre Abono</span><span>{fmt(resultado.tercoAbono)}</span></div></>}
            <div className="border-t pt-4 flex justify-between text-lg font-bold"><span>Total Bruto</span><span className="text-green-600">{fmt(resultado.total)}</span></div>
          </CardContent></Card>
        )}
      </div>
    </PageLayout>
  );
}
