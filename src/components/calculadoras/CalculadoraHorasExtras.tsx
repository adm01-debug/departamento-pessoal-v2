/**
 * @fileoverview Calculadora de Horas Extras
 * @version V8.1 - Corrigido por análise QA
 */
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Clock, Info } from 'lucide-react';
import { calcularHoraExtra, calcularDSR, formatCurrency, JORNADA_MENSAL_PADRAO } from '@/lib/calculosTrabalhistas';
import { cn } from '@/lib/utils';

interface CalculadoraHorasExtrasProps {
  onCalculate?: (result: any) => void;
  className?: string;
}

type PercentualHE = 50 | 100;

export const CalculadoraHorasExtras: React.FC<CalculadoraHorasExtrasProps> = ({ 
  onCalculate,
  className 
}) => {
  const [salario, setSalario] = useState('');
  const [horas, setHoras] = useState('');
  const [percentual, setPercentual] = useState<PercentualHE>(50);
  const [jornada, setJornada] = useState(String(JORNADA_MENSAL_PADRAO));
  const [calcularDSRFlag, setCalcularDSRFlag] = useState(true);
  const [resultado, setResultado] = useState<{
    salarioHora: number;
    valorHoraExtra: number;
    totalHorasExtras: number;
    dsr: number;
    totalComDSR: number;
  } | null>(null);

  const salarioNumerico = useMemo(() => {
    const num = parseFloat(salario.replace(/[^\d,.-]/g, '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [salario]);

  const horasNumericas = useMemo(() => {
    const num = parseFloat(horas.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }, [horas]);

  const jornadaNumerica = useMemo(() => {
    const num = parseInt(jornada);
    return isNaN(num) || num <= 0 ? JORNADA_MENSAL_PADRAO : num;
  }, [jornada]);

  const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/[^\d,.-]/g, '');
    setSalario(cleanValue);
  };

  const calcular = () => {
    if (salarioNumerico <= 0 || horasNumericas <= 0) return;
    
    const salarioHora = salarioNumerico / jornadaNumerica;
    const valorHoraExtra = calcularHoraExtra(salarioNumerico, jornadaNumerica, percentual);
    const totalHorasExtras = valorHoraExtra * horasNumericas;
    
    // DSR sobre horas extras (se habilitado)
    const dsr = calcularDSRFlag ? calcularDSR(totalHorasExtras) : 0;
    
    const res = {
      salarioHora: Math.round(salarioHora * 100) / 100,
      valorHoraExtra,
      totalHorasExtras: Math.round(totalHorasExtras * 100) / 100,
      dsr,
      totalComDSR: Math.round((totalHorasExtras + dsr) * 100) / 100,
    };
    
    setResultado(res);
    onCalculate?.(res);
  };

  const limpar = () => {
    setSalario('');
    setHoras('');
    setPercentual(50);
    setResultado(null);
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Calculadora de Horas Extras
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calcule HE 50% (dias úteis) ou 100% (DSR/feriados)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salario-base">Salário Base Mensal (R$)</Label>
          <Input
            id="salario-base"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={salario}
            onChange={handleSalarioChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horas">Quantidade de Horas</Label>
            <Input
              id="horas"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="percentual">Percentual</Label>
            <Select 
              value={String(percentual)} 
              onValueChange={(v) => setPercentual(Number(v) as PercentualHE)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50% (Dias úteis)</SelectItem>
                <SelectItem value="100">100% (DSR/Feriados)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jornada">Jornada Mensal (horas)</Label>
          <Select value={jornada} onValueChange={setJornada}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="220">220h (44h/sem)</SelectItem>
              <SelectItem value="200">200h (40h/sem)</SelectItem>
              <SelectItem value="180">180h (36h/sem)</SelectItem>
              <SelectItem value="150">150h (30h/sem)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="calcular-dsr"
            checked={calcularDSRFlag}
            onChange={(e) => setCalcularDSRFlag(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="calcular-dsr" className="text-sm cursor-pointer">
            Calcular DSR sobre horas extras
          </Label>
        </div>

        {resultado && (
          <div className="space-y-3">
            {/* Resultado Principal */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor da hora normal:</span>
                  <span className="font-medium">{formatCurrency(resultado.salarioHora)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor HE {percentual}%:</span>
                  <span className="font-medium">{formatCurrency(resultado.valorHoraExtra)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm">Total ({horasNumericas}h x {formatCurrency(resultado.valorHoraExtra)}):</span>
                  <span className="font-bold text-primary">{formatCurrency(resultado.totalHorasExtras)}</span>
                </div>
                {calcularDSRFlag && resultado.dsr > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DSR sobre HE:</span>
                      <span className="font-medium">{formatCurrency(resultado.dsr)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total com DSR:</span>
                      <span className="text-primary">{formatCurrency(resultado.totalComDSR)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fórmula */}
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              <p className="font-medium mb-1">Fórmula:</p>
              <p>Hora Extra = (Salário / Jornada) × {(1 + percentual / 100).toFixed(2)}</p>
              {calcularDSRFlag && <p className="mt-1">DSR = (Total HE / Dias úteis) × Domingos</p>}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p><strong>HE 50%:</strong> Primeiras 2h extras em dias úteis</p>
            <p><strong>HE 100%:</strong> Domingos, feriados e após 2h extras</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          onClick={calcular} 
          className="flex-1" 
          disabled={salarioNumerico <= 0 || horasNumericas <= 0}
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

export default CalculadoraHorasExtras;
