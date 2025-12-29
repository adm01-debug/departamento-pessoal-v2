/**
 * @fileoverview Calculadora de DSR (Descanso Semanal Remunerado)
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, Info, Calendar } from 'lucide-react';
import { calcularDSR, formatCurrency } from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraDSRProps {
  onCalculate?: (result: { valorBase: number; dsr: number; diasUteis: number; domingos: number }) => void;
  className?: string;
}

export const CalculadoraDSR: React.FC<CalculadoraDSRProps> = ({ 
  onCalculate,
  className 
}) => {
  const [valorVariaveis, setValorVariaveis] = useState('');
  const [diasUteis, setDiasUteis] = useState('22');
  const [domingos, setDomingos] = useState('4');
  const [resultado, setResultado] = useState<{
    valorBase: number;
    dsr: number;
    diasUteis: number;
    domingos: number;
    formula: string;
  } | null>(null);

  const valorNumerico = useMemo(() => {
    const num = parseFloat(valorVariaveis.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [valorVariaveis]);

  const diasUteisNum = useMemo(() => {
    const num = parseInt(diasUteis);
    return isNaN(num) || num <= 0 ? 22 : num;
  }, [diasUteis]);

  const domingosNum = useMemo(() => {
    const num = parseInt(domingos);
    return isNaN(num) || num < 0 ? 4 : num;
  }, [domingos]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^\d,.-]/g, '');
    setValorVariaveis(cleanValue);
  };

  const calcular = () => {
    if (valorNumerico <= 0) return;
    
    const dsr = calcularDSR(valorNumerico, diasUteisNum, domingosNum);
    
    const res = {
      valorBase: valorNumerico,
      dsr,
      diasUteis: diasUteisNum,
      domingos: domingosNum,
      formula: `(${formatCurrency(valorNumerico)} / ${diasUteisNum}) × ${domingosNum}`,
    };
    
    setResultado(res);
    onCalculate?.({ 
      valorBase: valorNumerico, 
      dsr, 
      diasUteis: diasUteisNum, 
      domingos: domingosNum 
    });
  };

  const limpar = () => {
    setValorVariaveis('');
    setDiasUteis('22');
    setDomingos('4');
    setResultado(null);
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Calculadora DSR
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Descanso Semanal Remunerado sobre variáveis
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="valor-variaveis">Total de Variáveis do Mês (R$)</Label>
          <Input
            id="valor-variaveis"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={valorVariaveis}
            onChange={handleValorChange}
            onKeyDown={(e) => e.key === 'Enter' && calcular()}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" />
            Some: horas extras + comissões + adicional noturno + gratificações
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dias-uteis">Dias Úteis no Mês</Label>
            <Input
              id="dias-uteis"
              type="number"
              min="1"
              max="31"
              value={diasUteis}
              onChange={(e) => setDiasUteis(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domingos">Domingos e Feriados</Label>
            <Input
              id="domingos"
              type="number"
              min="0"
              max="10"
              value={domingos}
              onChange={(e) => setDomingos(e.target.value)}
            />
          </div>
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-900/20 dark:border-purple-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor do DSR:</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency(resultado.dsr)}
                </span>
              </div>
            </div>

            {/* Detalhamento */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
              <h4 className="font-medium">Memória de Cálculo:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total de variáveis:</span>
                  <span>{formatCurrency(resultado.valorBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dias úteis:</span>
                  <span>{resultado.diasUteis}</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos/Feriados:</span>
                  <span>{resultado.domingos}</span>
                </div>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p><strong>Fórmula:</strong> {resultado.formula}</p>
                </div>
              </div>
            </div>

            {/* Total com DSR */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total (Variáveis + DSR):</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(resultado.valorBase + resultado.dsr)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-2 bg-amber-50 rounded dark:bg-amber-900/20">
          <p className="font-medium text-amber-700 dark:text-amber-400">Quando calcular DSR?</p>
          <ul className="mt-1 space-y-0.5 list-disc list-inside">
            <li>Sobre comissões</li>
            <li>Sobre horas extras</li>
            <li>Sobre adicional noturno</li>
            <li>Sobre outras parcelas variáveis</li>
          </ul>
        </div>
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

export default CalculadoraDSR;
