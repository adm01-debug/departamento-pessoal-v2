import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DepartmentData {
  id: string;
  nome: string;
  colaboradores: number;
}

interface DepartmentChartProps {
  departamentos: DepartmentData[];
}

export function DepartmentChart({ departamentos }: DepartmentChartProps) {
  const maxValue = Math.max(...departamentos.map(d => d.colaboradores));
  
  const colors = [
    'bg-primary',
    'bg-info',
    'bg-success',
    'bg-warning',
    'bg-store',
  ];

  return (
    <div className="space-y-3">
      {departamentos.map((dept, index) => {
        const percentage = (dept.colaboradores / maxValue) * 100;
        return (
          <div key={dept.id} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{dept.nome}</span>
              <span className="text-sm font-semibold text-foreground">{dept.colaboradores}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500 group-hover:opacity-80",
                  colors[index % colors.length]
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}



