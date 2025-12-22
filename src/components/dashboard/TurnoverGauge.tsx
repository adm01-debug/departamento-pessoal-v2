import { memo } from 'react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TurnoverGaugeProps {
  admissoes: number;
  desligamentos: number;
  totalColaboradores: number;
}

export function TurnoverGauge({ admissoes, desligamentos, totalColaboradores }: TurnoverGaugeProps) {
  const { turnoverRate, data } = useMemo(() => {
    // Fórmula turnover: ((Admissões + Desligamentos) / 2) / Total * 100
    const rate = totalColaboradores > 0 
      ? (((admissoes + desligamentos) / 2) / totalColaboradores) * 100 
      : 0;
    
    const clampedRate = Math.min(rate, 100);
    
    return {
      turnoverRate: rate,
      data: [
        { name: 'Turnover', value: clampedRate },
        { name: 'Restante', value: 100 - clampedRate },
      ],
    };
  }, [admissoes, desligamentos, totalColaboradores]);

  const getColor = (rate: number) => {
    if (rate <= 5) return 'hsl(var(--success))';
    if (rate <= 10) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getLabel = (rate: number) => {
    if (rate <= 5) return 'Excelente';
    if (rate <= 10) return 'Atenção';
    return 'Crítico';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={50}
              outerRadius={65}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={getColor(turnoverRate)} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold text-foreground">
            {turnoverRate.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span 
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ 
            backgroundColor: `${getColor(turnoverRate)}20`,
            color: getColor(turnoverRate)
          }}
        >
          {getLabel(turnoverRate)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 text-center w-full">
        <div>
          <p className="text-lg font-semibold text-success">{admissoes}</p>
          <p className="text-xs text-muted-foreground">Admissões</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-destructive">{desligamentos}</p>
          <p className="text-xs text-muted-foreground">Desligamentos</p>
        </div>
      </div>
    </div>
  );
}

