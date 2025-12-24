/**
 * @fileoverview Resumo de ponto
 * @module components/ponto/PontoResumo
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface PontoResumoProps {
  periodo: string;
  horasTrabalhadas: number;
  horasEsperadas: number;
  horasExtras: number;
  horasDevidas: number;
  faltas: number;
  atrasos: number;
}

export const PontoResumo = memo(function PontoResumo({
  periodo, horasTrabalhadas, horasEsperadas, horasExtras, horasDevidas, faltas, atrasos
}: PontoResumoProps) {
  const percentual = horasEsperadas > 0 ? (horasTrabalhadas / horasEsperadas) * 100 : 0;
  const saldo = horasExtras - horasDevidas;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Resumo de Ponto - {periodo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Horas Trabalhadas</span>
            <span className="font-medium">{horasTrabalhadas}h / {horasEsperadas}h</span>
          </div>
          <Progress value={Math.min(percentual, 100)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" /><span className="text-sm">Horas Extras</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{horasExtras}h</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-4 w-4" /><span className="text-sm">Horas Devidas</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{horasDevidas}h</p>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="font-medium">Banco de Horas</span>
          <span className={`text-xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>{saldo >= 0 ? '+' : ''}{saldo}h</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-2 border rounded">
            <p className="text-lg font-bold text-orange-600">{faltas}</p>
            <p className="text-xs text-muted-foreground">Faltas</p>
          </div>
          <div className="p-2 border rounded">
            <p className="text-lg font-bold text-yellow-600">{atrasos}</p>
            <p className="text-xs text-muted-foreground">Atrasos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
