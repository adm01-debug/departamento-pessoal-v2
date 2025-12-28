import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface CalculadoraINSSProps { onCalculate?: (result: any) => void; }

export const CalculadoraINSS: React.FC<CalculadoraINSSProps> = ({ onCalculate }) => {
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const res = parseFloat(valor) * 0.11;
    setResultado(res);
    onCalculate?.({ valor, resultado: res });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />Calculadora INSS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Valor Base (R$)</Label>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
        {resultado !== null && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border">
            <p className="font-bold">Resultado: R$ {resultado.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={calcular} className="w-full">Calcular</Button>
      </CardFooter>
    </Card>
  );
};

export default CalculadoraINSS;
