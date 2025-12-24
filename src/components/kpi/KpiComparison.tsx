import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
interface KpiComparisonProps { label: string; valorAnterior: number; valorAtual: number; formato?: (v: number) => string; }
export const KpiComparison = memo(function KpiComparison({ label, valorAnterior, valorAtual, formato = v => String(v) }: KpiComparisonProps) {
  const diff = valorAtual - valorAnterior;
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{formato(valorAnterior)}</span>
        <ArrowRight className="h-4 w-4" />
        <span className={diff >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{formato(valorAtual)}</span>
      </div>
    </div>
  );
});
