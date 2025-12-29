/**
 * @fileoverview Gauge de turnover para dashboard
 * @module components/dashboard/TurnoverGauge
 * @version V8.2 - Import duplicado corrigido
 */
import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TurnoverGaugeProps {
  admissoes: number;
  desligamentos: number;
  totalColaboradores: number;
}

export const TurnoverGauge = memo(function TurnoverGauge({ admissoes, desligamentos, totalColaboradores }: TurnoverGaugeProps) {
  // Calcular taxa de turnover: ((Admissões + Desligamentos) / 2) / Total * 100
  const turnoverRate = useMemo(() => {
    if (totalColaboradores <= 0) return 0;
    return (((admissoes + desligamentos) / 2) / totalColaboradores) * 100;
  }, [admissoes, desligamentos, totalColaboradores]);

  // Determinar cor baseada na taxa
  const getColor = (rate: number) => {
    if (rate <= 5) return { stroke: 'stroke-success', text: 'text-success', label: 'Excelente' };
    if (rate <= 10) return { stroke: 'stroke-info', text: 'text-info', label: 'Bom' };
    if (rate <= 15) return { stroke: 'stroke-warning', text: 'text-warning', label: 'Atenção' };
    return { stroke: 'stroke-destructive', text: 'text-destructive', label: 'Crítico' };
  };

  const { stroke, text, label } = getColor(turnoverRate);
  
  // Calcular ângulo do gauge (0-180 graus = 0-30% turnover)
  const angle = Math.min(180, (turnoverRate / 30) * 180);
  
  // Calcular coordenadas do arco
  const radius = 70;
  const centerX = 100;
  const centerY = 90;
  
  const startAngle = -180;
  const endAngle = startAngle + angle;
  
  const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
  const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
  const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
  
  const largeArcFlag = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="110" viewBox="0 0 200 110" className="mb-2">
        {/* Background arc */}
        <path
          d="M 30 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-muted/30"
        />
        
        {/* Value arc */}
        {turnoverRate > 0 && (
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            className={stroke}
          />
        )}
        
        {/* Center text */}
        <text x={centerX} y={centerY - 10} textAnchor="middle" className="fill-foreground font-bold text-2xl">
          {turnoverRate.toFixed(1)}%
        </text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" className={cn("text-xs font-medium", text)}>
          {label}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Admissões: {admissoes}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive" />
          <span>Desligamentos: {desligamentos}</span>
        </div>
      </div>
    </div>
  );
});
