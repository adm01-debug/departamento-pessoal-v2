// V15-335
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { calcularINSS } from '@/calculators/inss';
import { calcularIRRF, calcularBaseIRRF } from '@/calculators/irrf';
import { calcularFGTS } from '@/calculators/fgts';
import { Calculator } from 'lucide-react';
export default function CalculadoraFolhaPage() {
  const [salario, setSalario] = useState(0); const [dependentes, setDependentes] = useState(0);
  const [resultado, setResultado] = useState<any>(null);
  const calcular = () => {
    const inss = calcularINSS(salario); const baseIRRF = calcularBaseIRRF(salario, inss);
    const irrf = calcularIRRF(baseIRRF, dependentes); const fgts = calcularFGTS(salario);
    const liquido = salario - inss - irrf;
    setResultado({ salario, inss, irrf, fgts, liquido });
  };
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <PageLayout title="Calculadora de Folha">
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Dados</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium">Salário Bruto</label><CurrencyInput value={salario} onChange={setSalario} /></div>
          <FormField label="Dependentes" type="number" value={dependentes} onChange={(e) => setDependentes(parseInt(e.target.value) || 0)} />
          <Button onClick={calcular} className="w-full"><Calculator className="h-4 w-4 mr-2" />Calcular</Button>
        </CardContent></Card>
        {resultado && (
          <Card><CardHeader><CardTitle>Resultado</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex justify-between"><span>Salário Bruto</span><span className="font-bold">{fmt(resultado.salario)}</span></div>
            <div className="flex justify-between text-red-600"><span>INSS</span><span>- {fmt(resultado.inss)}</span></div>
            <div className="flex justify-between text-red-600"><span>IRRF</span><span>- {fmt(resultado.irrf)}</span></div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold"><span>Líquido</span><span className="text-green-600">{fmt(resultado.liquido)}</span></div>
            <div className="border-t pt-4 flex justify-between text-sm text-muted-foreground"><span>FGTS (empresa)</span><span>{fmt(resultado.fgts)}</span></div>
          </CardContent></Card>
        )}
      </div>
    </PageLayout>
  );
}
