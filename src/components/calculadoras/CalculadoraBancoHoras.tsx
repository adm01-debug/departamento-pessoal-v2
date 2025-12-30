/**
 * @fileoverview Calculadora de Banco de Horas
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Clock, TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraBancoHorasProps {
  onCalculate?: (result: any) => void;
  className?: string;
}

export const CalculadoraBancoHoras: React.FC<CalculadoraBancoHorasProps> = ({ 
  onCalculate,
  className 
}) => {
  const [saldoAtual, setSaldoAtual] = useState('0');
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('');
  const [jornadaDiaria, setJornadaDiaria] = useState('8');
  const [diasTrabalhados, setDiasTrabalhados] = useState('');
  const [salarioBase, setSalarioBase] = useState('');
  
  const [resultado, setResultado] = useState<{
    jornadaEsperada: number;
    horasTrabalhadas: number;
    diferenca: number;
    novoSaldo: number;
    valorMonetario: number;
    status: 'positivo' | 'negativo' | 'zerado';
  } | null>(null);

  const parseNumber = (value: string): number => {
    const num = parseFloat(value.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  };

  const calcular = () => {
    const saldo = parseNumber(saldoAtual);
    const horas = parseNumber(horasTrabalhadas);
    const jornada = parseNumber(jornadaDiaria) || 8;
    const dias = parseNumber(diasTrabalhados);
    const salario = parseNumber(salarioBase.replace(/[^\d,.-]/g, ''));
    
    if (horas <= 0 || dias <= 0) return;
    
    const jornadaEsperada = jornada * dias;
    const diferenca = horas - jornadaEsperada;
    const novoSaldo = saldo + diferenca;
    
    // Valor monetário do saldo (se tiver salário)
    const valorHora = salario > 0 ? salario / 220 : 0;
    const valorMonetario = Math.abs(novoSaldo) * valorHora;
    
    const status = (novoSaldo > 0 ? 'positivo' : novoSaldo < 0 ? 'negativo' : 'zerado') as
      | 'positivo'
      | 'negativo'
      | 'zerado';

    const res = {
      jornadaEsperada,
      horasTrabalhadas: horas,
      diferenca,
      novoSaldo,
      valorMonetario,
      status,
    };
    
    setResultado(res);
    onCalculate?.(res);
  };

  const limpar = () => {
    setSaldoAtual('0');
    setHorasTrabalhadas('');
    setDiasTrabalhados('');
    setSalarioBase('');
    setResultado(null);
  };

  const formatHoras = (horas: number): string => {
    const h = Math.floor(Math.abs(horas));
    const m = Math.round((Math.abs(horas) - h) * 60);
    const sinal = horas < 0 ? '-' : '+';
    return `${sinal}${h}h${m.toString().padStart(2, '0')}min`;
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Banco de Horas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Controle de saldo de horas trabalhadas
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="saldo-atual">Saldo Atual (horas)</Label>
          <Input
            id="saldo-atual"
            type="number"
            step="0.5"
            placeholder="0"
            value={saldoAtual}
            onChange={(e) => setSaldoAtual(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Positivo = horas a compensar | Negativo = horas devidas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horas-trabalhadas">Horas Trabalhadas</Label>
            <Input
              id="horas-trabalhadas"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={horasTrabalhadas}
              onChange={(e) => setHorasTrabalhadas(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dias-trabalhados">Dias Trabalhados</Label>
            <Input
              id="dias-trabalhados"
              type="number"
              min="1"
              max="31"
              placeholder="22"
              value={diasTrabalhados}
              onChange={(e) => setDiasTrabalhados(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jornada-diaria">Jornada Diária (horas)</Label>
          <Input
            id="jornada-diaria"
            type="number"
            step="0.5"
            min="4"
            max="12"
            value={jornadaDiaria}
            onChange={(e) => setJornadaDiaria(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salario-base">Salário Base (opcional, para valor R$)</Label>
          <Input
            id="salario-base"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={salarioBase}
            onChange={(e) => setSalarioBase(e.target.value)}
          />
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className={cn(
              'p-4 rounded-lg border',
              resultado.status === 'positivo' && 'bg-green-50 border-green-200 dark:bg-green-900/20',
              resultado.status === 'negativo' && 'bg-red-50 border-red-200 dark:bg-red-900/20',
              resultado.status === 'zerado' && 'bg-gray-50 border-gray-200 dark:bg-gray-800'
            )}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Novo Saldo:</span>
                <div className="flex items-center gap-2">
                  {resultado.status === 'positivo' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {resultado.status === 'negativo' && <TrendingDown className="w-5 h-5 text-red-600" />}
                  <span className={cn(
                    'text-xl font-bold',
                    resultado.status === 'positivo' && 'text-green-600',
                    resultado.status === 'negativo' && 'text-red-600'
                  )}>
                    {formatHoras(resultado.novoSaldo)}
                  </span>
                </div>
              </div>
              
              {resultado.valorMonetario > 0 && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Valor equivalente:</span>
                  <span className="font-medium">{formatCurrency(resultado.valorMonetario)}</span>
                </div>
              )}
            </div>

            {/* Detalhamento */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
              <h4 className="font-medium">Memória de Cálculo:</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Jornada esperada ({parseNumber(diasTrabalhados)} dias × {parseNumber(jornadaDiaria)}h):</span>
                  <span>{resultado.jornadaEsperada}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Horas trabalhadas:</span>
                  <span>{resultado.horasTrabalhadas}h</span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t">
                  <span>Diferença no período:</span>
                  <span className={cn(
                    resultado.diferenca >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {formatHoras(resultado.diferenca)}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerta de limite */}
            {Math.abs(resultado.novoSaldo) > 60 && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded text-amber-700 text-sm dark:bg-amber-900/20 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Atenção: Saldo acima de 60h. Verifique acordo de banco de horas 
                  para limite máximo permitido.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            O banco de horas deve ser formalizado em acordo coletivo ou individual. 
            Compensação em até 6 meses (individual) ou 12 meses (coletivo).
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          onClick={calcular} 
          className="flex-1" 
          disabled={parseNumber(horasTrabalhadas) <= 0 || parseNumber(diasTrabalhados) <= 0}
        >
          Calcular
        </Button>
        <Button variant="outline" onClick={limpar}>
          Limpar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalculadoraBancoHoras;
