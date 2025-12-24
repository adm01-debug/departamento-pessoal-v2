import { memo } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
interface ComparisonProps { atual: number; anterior: number; label?: string; }
export const Comparison = memo(function Comparison({ atual, anterior, label }: ComparisonProps) {
  const diff = anterior !== 0 ? ((atual - anterior) / anterior) * 100 : 0;
  const Icon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus;
  const color = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-muted-foreground";
  return <span className={`inline-flex items-center gap-1 text-sm ${color}`}><Icon className="h-4 w-4" />{Math.abs(diff).toFixed(1)}%{label && <span className="text-muted-foreground ml-1">{label}</span>}</span>;
});
