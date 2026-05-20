import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Users } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export function RewardsSimulator() {
  const [employees, setEmployees] = React.useState(50);
  const [avgSalary, setAvgSalary] = React.useState(4500);
  const [bonusPercent, setBonusPercent] = React.useState(10);
  const [performanceLevel, setPerformanceLevel] = React.useState(85);

  const totalBudget = employees * avgSalary * (bonusPercent / 100) * (performanceLevel / 100);
  const roi = (performanceLevel / 100) * 2.5; // Arbitrary multiplier for ROI simulation

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 border-border/30 rounded-2xl shadow-sm">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-tighter">Número de Colaboradores Elegíveis</Label>
              <Badge variant="outline" className="font-mono">{employees}</Badge>
            </div>
            <Slider value={[employees]} onValueChange={([v]) => setEmployees(v)} max={500} step={5} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-tighter">Salário Base Médio</Label>
              <Badge variant="outline" className="font-mono">{formatCurrency(avgSalary)}</Badge>
            </div>
            <Slider value={[avgSalary]} onValueChange={([v]) => setAvgSalary(v)} min={1500} max={25000} step={100} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-tighter">% de Bônus Alvo (100% da Meta)</Label>
              <Badge variant="outline" className="font-mono">{bonusPercent}%</Badge>
            </div>
            <Slider value={[bonusPercent]} onValueChange={([v]) => setBonusPercent(v)} max={100} step={1} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold uppercase tracking-tighter">Previsão de Atingimento Global</Label>
              <Badge variant="outline" className="font-mono">{performanceLevel}%</Badge>
            </div>
            <Slider value={[performanceLevel]} onValueChange={([v]) => setPerformanceLevel(v)} max={120} step={5} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 rounded-2xl overflow-hidden relative">
          <Calculator className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
          <CardContent className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Payout Estimado</p>
            <h2 className="text-3xl font-bold mt-1">{formatCurrency(totalBudget)}</h2>
            <div className="mt-6 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
                <span>Eficiência de Custo</span>
                <span>{performanceLevel > 100 ? 'ALTA' : 'IDEAL'}</span>
              </div>
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${Math.min(performanceLevel, 100)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/30 rounded-2xl shadow-sm bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-success">Impacto ROI Projetado</p>
            </div>
            <h2 className="text-2xl font-bold text-success">{roi.toFixed(1)}x</h2>
            <p className="text-[10px] text-muted-foreground mt-1">Para cada R$ 1 investido em prêmios, estimamos R$ {roi.toFixed(1)} em ganho de produtividade.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
