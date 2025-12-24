import { memo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
interface StatTrendProps { valor: number; periodo?: string; }
export const StatTrend = memo(function StatTrend({ valor, periodo }: StatTrendProps) {
  const Icon = valor > 0 ? TrendingUp : valor < 0 ? TrendingDown : Minus;
  const color = valor > 0 ? "text-green-600" : valor < 0 ? "text-red-600" : "text-muted-foreground";
  return <span className={`inline-flex items-center gap-1 text-sm ${color}`}><Icon className="h-4 w-4" />{Math.abs(valor)}%{periodo && <span className="text-muted-foreground ml-1">{periodo}</span>}</span>;
});
