import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface YearComparisonData {
  ano: number;
  admissoes: number;
  desligamentos: number;
  turnover: number;
}

interface TurnoverYearComparisonChartProps {
  data: YearComparisonData[];
  loading?: boolean;
}

export function TurnoverYearComparisonChart({ data, loading }: TurnoverYearComparisonChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Comparativo Anual de Turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular variação ano a ano
  const getVariacao = () => {
    if (data.length < 2) return null;
    const atual = data[data.length - 1];
    const anterior = data[data.length - 2];
    if (!anterior || anterior.turnover === 0) return null;
    return ((atual.turnover - anterior.turnover) / anterior.turnover) * 100;
  };

  const variacao = getVariacao();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Comparativo Anual de Turnover</CardTitle>
        {variacao !== null && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            variacao < 0 ? 'text-success' : variacao > 0 ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {variacao < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : variacao > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>{variacao > 0 ? '+' : ''}{variacao.toFixed(1)}% vs ano anterior</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Sem dados históricos disponíveis
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="ano" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    admissoes: 'Admissões',
                    desligamentos: 'Desligamentos',
                    turnover: 'Taxa Turnover'
                  };
                  const suffix = name === 'turnover' ? '%' : '';
                  return [`${value}${suffix}`, labels[name] || name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    admissoes: 'Admissões',
                    desligamentos: 'Desligamentos',
                    turnover: 'Taxa Turnover (%)'
                  };
                  return labels[value] || value;
                }}
              />
              <Bar 
                dataKey="admissoes" 
                fill="hsl(var(--success))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="desligamentos" 
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="turnover" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Tabela resumo */}
        {data.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Ano</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Admissões</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Desligamentos</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Turnover</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.ano} className={idx < data.length - 1 ? 'border-b border-border/50' : ''}>
                    <td className="py-2 font-medium">{row.ano}</td>
                    <td className="py-2 text-center text-success">{row.admissoes}</td>
                    <td className="py-2 text-center text-destructive">{row.desligamentos}</td>
                    <td className="py-2 text-center font-semibold">{row.turnover.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



