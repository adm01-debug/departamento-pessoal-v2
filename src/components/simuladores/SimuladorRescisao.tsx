import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SimuladorRescisaoProps { onCalculate?: (result: any) => void; }

export const SimuladorRescisao: React.FC<SimuladorRescisaoProps> = ({ onCalculate }) => {
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const res = parseFloat(valor) * 1.1;
    setResultado(res);
    onCalculate?.({ valor, resultado: res });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Simulador de Rescisão</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Valor Base</Label>
          <Input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" />
        </div>
        {resultado && (
          <div className="p-4 bg-muted rounded">
            <p className="text-lg font-bold">Resultado: R$ {resultado.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={calcular} className="w-full">Calcular</Button>
      </CardFooter>
    </Card>
  );
};

export default SimuladorRescisao;
