import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { useMemo } from 'react';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdmissionsLineChartProps {
  colaboradores?: typeof [];
  months?: number;
}

export function AdmissionsLineChart({ colaboradores = [], months = 12 }: AdmissionsLineChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const startDate = startOfMonth(subMonths(now, months - 1));
    const endDate = startOfMonth(now);
    
    // Gerar todos os meses no intervalo
    const monthsInterval = eachMonthOfInterval({ start: startDate, end: endDate });
    
    // Contar admissões por mês
    const admissionsByMonth: Record<string, number> = {};
    
    colaboradores.forEach(c => {
      const admDate = parseISO(c.dataAdmissao);
      const monthKey = format(startOfMonth(admDate), 'yyyy-MM');
      admissionsByMonth[monthKey] = (admissionsByMonth[monthKey] || 0) + 1;
    });

    // Criar dados com acumulado
    let accumulated = 0;
    
    // Contar colaboradores admitidos antes do período
    colaboradores.forEach(c => {
      const admDate = parseISO(c.dataAdmissao);
      if (admDate < startDate) {
        accumulated++;
      }
    });

    return monthsInterval.map(month => {
      const monthKey = format(month, 'yyyy-MM');
      const admissionsInMonth = admissionsByMonth[monthKey] || 0;
      accumulated += admissionsInMonth;
      
      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        fullMonth: format(month, 'MMMM yyyy', { locale: ptBR }),
        admissoes: admissionsInMonth,
        total: accumulated,
      };
    });
  }, [colaboradores, months]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            labelFormatter={(_, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullMonth;
              }
              return '';
            }}
            formatter={(value: number, name: string) => {
              const label = name === 'admissoes' ? 'Admissões no mês' : 'Total acumulado';
              return [value, label];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            name="total"
          />
          <Line 
            type="monotone" 
            dataKey="admissoes" 
            stroke="hsl(var(--success))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--success))', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: 'hsl(var(--success))' }}
            name="admissoes"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">Total acumulado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-success rounded" style={{ borderStyle: 'dashed' }} />
          <span className="text-xs text-muted-foreground">Admissões no mês</span>
        </div>
      </div>
    </div>
  );
}

