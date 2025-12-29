/**
 * @fileoverview Calculadora de INSS com cálculo progressivo 2025
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, Info } from 'lucide-react';
import { calcularINSS, formatCurrency, TABELA_INSS_2025, TETO_INSS } from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraINSSProps {
  onCalculate?: (result: ReturnType<typeof calcularINSS>) => void;
  className?: string;
}

export const CalculadoraINSS: React.FC<CalculadoraINSSProps> = ({ 
  onCalculate,
  className 
}) => {
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState<ReturnType<typeof calcularINSS> | null>(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const valorNumerico = useMemo(() => {
    const num = parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [valor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Permitir apenas números, vírgula e ponto
    const cleanValue = rawValue.replace(/[^\d,.-]/g, '');
    setValor(cleanValue);
  };

  const calcular = () => {
    if (valorNumerico <= 0) {
      return;
    }
    
    const res = calcularINSS(valorNumerico);
    setResultado(res);
    onCalculate?.(res);
  };

  const limpar = () => {
    setValor('');
    setResultado(null);
    setMostrarDetalhes(false);
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora INSS 2025
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cálculo progressivo conforme tabela vigente
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="valor-base">Salário Bruto (R$)</Label>
          <Input
            id="valor-base"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={valor}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && calcular()}
          />
          {valorNumerico > TETO_INSS && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Valor acima do teto ({formatCurrency(TETO_INSS)}). Base limitada.
            </p>
          )}
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor INSS:</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(resultado.valorINSS)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Alíquota Efetiva:</span>
                <span className="font-medium">
                  {resultado.aliquotaEfetiva.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Base de Cálculo:</span>
                <span className="font-medium">
                  {formatCurrency(resultado.baseCalculo)}
                </span>
              </div>
            </div>

            {/* Botão Detalhes */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
              className="w-full"
            >
              {mostrarDetalhes ? 'Ocultar Detalhes' : 'Ver Detalhamento por Faixa'}
            </Button>

            {/* Detalhamento */}
            {mostrarDetalhes && resultado.detalhamento.length > 0 && (
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium">Detalhamento por Faixa:</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-1">Faixa</th>
                      <th className="py-1 text-right">Base</th>
                      <th className="py-1 text-right">Alíq.</th>
                      <th className="py-1 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.detalhamento.map((d, i) => (
                      <tr key={i} className="border-t border-muted">
                        <td className="py-1">{d.faixa}ª</td>
                        <td className="py-1 text-right">{formatCurrency(d.base)}</td>
                        <td className="py-1 text-right">{d.aliquota}%</td>
                        <td className="py-1 text-right font-medium">{formatCurrency(d.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-primary/30 font-bold">
                      <td className="py-2" colSpan={3}>Total</td>
                      <td className="py-2 text-right text-primary">
                        {formatCurrency(resultado.valorINSS)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tabela de Referência */}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">
            Ver tabela INSS 2025
          </summary>
          <div className="mt-2 p-2 bg-muted/30 rounded">
            {TABELA_INSS_2025.map((faixa, i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span>
                  {i === 0 ? 'Até' : 'De'} {formatCurrency(faixa.valorInicial)} 
                  {i > 0 && ` a ${formatCurrency(faixa.valorFinal)}`}
                </span>
                <span>{(faixa.aliquota * 100).toFixed(1)}%</span>
              </div>
            ))}
            <div className="mt-1 pt-1 border-t">
              Teto: {formatCurrency(TETO_INSS)}
            </div>
          </div>
        </details>
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

export default CalculadoraINSS;
