/**
 * @fileoverview Calculadora de FGTS
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { calcularFGTS, formatCurrency, ALIQUOTA_FGTS } from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraFGTSProps {
  onCalculate?: (result: { remuneracao: number; fgts: number; anual: number }) => void;
  className?: string;
}

export const CalculadoraFGTS: React.FC<CalculadoraFGTSProps> = ({ 
  onCalculate,
  className 
}) => {
  const [remuneracao, setRemuneracao] = useState('');
  const [resultado, setResultado] = useState<{
    remuneracao: number;
    fgts: number;
    anual: number;
    decimo: number;
    ferias: number;
    totalAnual: number;
  } | null>(null);

  const valorNumerico = useMemo(() => {
    const num = parseFloat(remuneracao.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [remuneracao]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^\d,.-]/g, '');
    setRemuneracao(cleanValue);
  };

  const calcular = () => {
    if (valorNumerico <= 0) return;
    
    const fgtsMensal = calcularFGTS(valorNumerico);
    const fgtsAnual = fgtsMensal * 12;
    const fgtsDecimo = calcularFGTS(valorNumerico); // FGTS sobre 13º
    const fgtsFerias = calcularFGTS(valorNumerico * 4 / 3); // FGTS sobre férias + 1/3
    const totalAnual = fgtsAnual + fgtsDecimo + fgtsFerias;
    
    const res = {
      remuneracao: valorNumerico,
      fgts: fgtsMensal,
      anual: fgtsAnual,
      decimo: fgtsDecimo,
      ferias: fgtsFerias,
      totalAnual,
    };
    
    setResultado(res);
    onCalculate?.({ remuneracao: valorNumerico, fgts: fgtsMensal, anual: totalAnual });
  };

  const limpar = () => {
    setRemuneracao('');
    setResultado(null);
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora FGTS
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fundo de Garantia por Tempo de Serviço ({(ALIQUOTA_FGTS * 100).toFixed(0)}%)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="remuneracao">Remuneração Mensal (R$)</Label>
          <Input
            id="remuneracao"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={remuneracao}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && calcular()}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Inclua salário + horas extras + adicionais + comissões
          </p>
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FGTS Mensal:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(resultado.fgts)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">Alíquota:</span>
                <span className="font-medium">{(ALIQUOTA_FGTS * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Projeção Anual */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                Projeção Anual
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>12 meses de salário:</span>
                  <span>{formatCurrency(resultado.anual)}</span>
                </div>
                <div className="flex justify-between">
                  <span>13º salário:</span>
                  <span>{formatCurrency(resultado.decimo)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Férias + 1/3:</span>
                  <span>{formatCurrency(resultado.ferias)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Anual Estimado:</span>
                  <span className="text-blue-600">{formatCurrency(resultado.totalAnual)}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground p-2 bg-amber-50 rounded dark:bg-amber-900/20">
              <p className="font-medium text-amber-700 dark:text-amber-400">Lembre-se:</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>FGTS é pago pelo empregador (não desconta do salário)</li>
                <li>Depositado até dia 7 de cada mês</li>
                <li>Rende 3% a.a. + TR</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button onClick={calcular} className="flex-1" disabled={valorNumerico <= 0}>
          Calcular
        </Button>
        <Button variant="outline" onClick={limpar}>
          Limpar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculadoraFGTS;
