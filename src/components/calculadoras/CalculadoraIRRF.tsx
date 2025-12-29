/**
 * @fileoverview Calculadora de IRRF com tabela 2025
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, Info, Users } from 'lucide-react';
import { 
  calcularINSS, 
  calcularIRRF, 
  formatCurrency, 
  TABELA_IRRF_2025, 
  DEDUCAO_DEPENDENTE_IRRF 
} from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraIRRFProps {
  onCalculate?: (result: ReturnType<typeof calcularIRRF> & { inss: number }) => void;
  className?: string;
}

export const CalculadoraIRRF: React.FC<CalculadoraIRRFProps> = ({ 
  onCalculate,
  className 
}) => {
  const [salarioBruto, setSalarioBruto] = useState('');
  const [dependentes, setDependentes] = useState('0');
  const [resultado, setResultado] = useState<(ReturnType<typeof calcularIRRF> & { 
    inss: number; 
    salarioBruto: number;
    deducaoDependentes: number;
  }) | null>(null);

  const salarioNumerico = useMemo(() => {
    const num = parseFloat(salarioBruto.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [salarioBruto]);

  const numDependentes = useMemo(() => {
    const num = parseInt(dependentes);
    return isNaN(num) || num < 0 ? 0 : num;
  }, [dependentes]);

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^\d,.-]/g, '');
    setSalarioBruto(cleanValue);
  };

  const calcular = () => {
    if (salarioNumerico <= 0) return;
    
    // Calcular INSS primeiro
    const inssCalc = calcularINSS(salarioNumerico);
    
    // Calcular IRRF
    const irrfCalc = calcularIRRF(salarioNumerico, inssCalc.valorINSS, numDependentes);
    
    const res = {
      ...irrfCalc,
      inss: inssCalc.valorINSS,
      salarioBruto: salarioNumerico,
      deducaoDependentes: numDependentes * DEDUCAO_DEPENDENTE_IRRF,
    };
    
    setResultado(res);
    onCalculate?.(res);
  };

  const limpar = () => {
    setSalarioBruto('');
    setDependentes('0');
    setResultado(null);
  };

  const getFaixaLabel = (faixa: number): string => {
    const labels = ['Isento', '7,5%', '15%', '22,5%', '27,5%'];
    return labels[faixa] || 'N/A';
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora IRRF 2025
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Imposto de Renda Retido na Fonte
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salario-bruto">Salário Bruto (R$)</Label>
          <Input
            id="salario-bruto"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={salarioBruto}
            onChange={handleSalarioChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependentes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Número de Dependentes
          </Label>
          <Input
            id="dependentes"
            type="number"
            min="0"
            max="20"
            value={dependentes}
            onChange={(e) => setDependentes(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Dedução por dependente: {formatCurrency(DEDUCAO_DEPENDENTE_IRRF)}
          </p>
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className={cn(
              'p-4 rounded-lg border',
              resultado.valorIRRF > 0 
                ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            )}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor IRRF:</span>
                <span className={cn(
                  'text-xl font-bold',
                  resultado.valorIRRF > 0 ? 'text-amber-600' : 'text-green-600'
                )}>
                  {resultado.valorIRRF > 0 
                    ? formatCurrency(resultado.valorIRRF) 
                    : 'ISENTO'}
                </span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-current/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faixa:</span>
                  <span className="font-medium">{getFaixaLabel(resultado.faixa || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alíquota:</span>
                  <span className="font-medium">{resultado.aliquota}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dedução legal:</span>
                  <span className="font-medium">{formatCurrency(resultado.deducao)}</span>
                </div>
              </div>
            </div>

            {/* Detalhamento do Cálculo */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
              <h4 className="font-medium">Composição do Cálculo:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Salário Bruto:</span>
                  <span>{formatCurrency(resultado.salarioBruto)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>(-) INSS:</span>
                  <span>{formatCurrency(resultado.inss)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>(-) Dedução Dependentes ({numDependentes}):</span>
                  <span>{formatCurrency(resultado.deducaoDependentes)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Base de Cálculo IRRF:</span>
                  <span>{formatCurrency(resultado.baseCalculo)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Referência */}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">
            Ver tabela IRRF 2025
          </summary>
          <div className="mt-2 p-2 bg-muted/30 rounded space-y-1">
            {TABELA_IRRF_2025.map((faixa, i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span>
                  {faixa.aliquota === 0 
                    ? `Até ${formatCurrency(faixa.valorFinal)}`
                    : faixa.valorFinal === Infinity 
                      ? `Acima de ${formatCurrency(faixa.valorInicial)}`
                      : `${formatCurrency(faixa.valorInicial)} a ${formatCurrency(faixa.valorFinal)}`
                  }
                </span>
                <span>
                  {faixa.aliquota === 0 
                    ? 'Isento' 
                    : `${(faixa.aliquota * 100).toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </details>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={calcular} className="flex-1" disabled={salarioNumerico <= 0}>
          Calcular
        </Button>
        <Button variant="outline" onClick={limpar}>
          Limpar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculadoraIRRF;
