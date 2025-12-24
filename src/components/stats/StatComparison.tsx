import { memo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
interface StatComparisonProps { valorAtual: number; valorAnterior: number; formato?: (v: number) => string; }
export const StatComparison = memo(function StatComparison({ valorAtual, valorAnterior, formato = v => String(v) }: StatComparisonProps) {
  const diff = valorAnterior !== 0 ? ((valorAtual - valorAnterior) / valorAnterior) * 100 : 0;
  const isUp = diff >= 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">{formato(valorAtual)}</span>
      <span className={`flex items-center text-sm ${isUp ? "text-green-600" : "text-red-600"}`}>{isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{Math.abs(diff).toFixed(1)}%</span>
    </div>
  );
});
