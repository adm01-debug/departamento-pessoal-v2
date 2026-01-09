import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";

interface SalaryEntry { date: string; value: number; reason: string; }
interface SalaryHistoryProps { entries: SalaryEntry[]; className?: string; }

export function SalaryHistory({ entries, className }: SalaryHistoryProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">Histórico Salarial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          {entries.map((entry, i) => {
            const prevValue = i < entries.length - 1 ? entries[i + 1].value : entry.value;
            const change = ((entry.value - prevValue) / prevValue) * 100;
            return (
              <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10"><TrendingUp className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{formatCurrency(entry.value)}</p>
                    {i < entries.length - 1 && change !== 0 && <span className={cn("text-sm", change > 0 ? "text-green-600" : "text-red-600")}>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.reason}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{entry.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default SalaryHistory;
