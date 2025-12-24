/**
 * @fileoverview Lista de registros de ponto
 * @module components/ponto/PontoList
 */
import { memo } from 'react';
import { PontoCard } from './PontoCard';
import { Clock } from 'lucide-react';

interface Registro { tipo: 'entrada' | 'saida' | 'intervalo_inicio' | 'intervalo_fim'; hora: string; }
interface Ponto { id: string; colaborador: string; data: string; registros: Registro[]; horasTrabalhadas?: string; status: 'completo' | 'incompleto' | 'falta' | 'ferias' | 'folga'; }
interface PontoListProps { pontos: Ponto[]; }

export const PontoList = memo(function PontoList({ pontos }: PontoListProps) {
  if (pontos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mb-4 opacity-50" />
        <p>Nenhum registro de ponto encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pontos.map(ponto => <PontoCard key={ponto.id} {...ponto} />)}
    </div>
  );
});
