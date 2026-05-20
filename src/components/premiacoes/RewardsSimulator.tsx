import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Save, History, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export function RewardsSimulator() {
  const [employees, setEmployees] = React.useState(50);
  const [avgSalary, setAvgSalary] = React.useState(4500);
  const [bonusPercent, setBonusPercent] = React.useState(10);
  const [performanceLevel, setPerformanceLevel] = React.useState(85);
  const [retentionImpact, setRetentionImpact] = React.useState(5); // % de redução de turnover
  const [scenarios, setScenarios] = React.useState<any[]>([]);

  const totalBudget = employees * avgSalary * (bonusPercent / 100) * (performanceLevel / 100);
  const turnoverCost = avgSalary * 3 * employees * 0.15; // Custo estimado de turnover anual (15% rate)
  const savings = turnoverCost * (retentionImpact / 100);
  const roi = totalBudget > 0 ? (savings / totalBudget) : 0;

  const saveScenario = () => {
    const newScenario = {
      id: Date.now(),
      employees,
      avgSalary,
      bonusPercent,
      performanceLevel,
      totalBudget,
      roi,
      timestamp: new Date().toLocaleTimeString()
    };
    setScenarios([newScenario, ...scenarios.slice(0, 2)]);
    toast.success("Cenário salvo para comparação!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Simulador de ROI de Capital Humano</h3>
          <p className="text-sm text-muted-foreground">Projete o impacto financeiro das suas campanhas de premiação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => {
            setEmployees(50);
            setAvgSalary(4500);
            setBonusPercent(10);
            setPerformanceLevel(85);
            setRetentionImpact(5);
          }}>
            <RefreshCw className="h-4 w-4" /> Resetar
          </Button>
          <Button size="sm" className="gap-2 rounded-xl" onClick={saveScenario}>
            <Save className="h-4 w-4" /> Salvar Cenário
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border/30 rounded-2xl shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Colaboradores Elegíveis</Label>
                <Badge variant="outline" className="font-mono bg-background">{employees}</Badge>
              </div>
              <Slider value={[employees]} onValueChange={([v]: number[]) => setEmployees(v)} max={1000} step={10} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Salário Médio Mensal</Label>
                <Badge variant="outline" className="font-mono bg-background">{formatCurrency(avgSalary)}</Badge>
              </div>
              <Slider value={[avgSalary]} onValueChange={([v]: number[]) => setAvgSalary(v)} min={1500} max={30000} step={500} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">% Bônus Alvo</Label>
                  <Badge variant="secondary" className="font-mono">{bonusPercent}%</Badge>
                </div>
                <Slider value={[bonusPercent]} onValueChange={([v]: number[]) => setBonusPercent(v)} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Atingimento de Meta</Label>
                  <Badge variant="secondary" className="font-mono">{performanceLevel}%</Badge>
                </div>
                <Slider value={[performanceLevel]} onValueChange={([v]: number[]) => setPerformanceLevel(v)} max={150} step={5} />
              </div>
            </div>

            <div className="pt-4 border-t border-border/10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold uppercase tracking-tighter text-muted-foreground">Redução Estimada de Turnover</Label>
                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>
                  <Badge variant="outline" className="font-mono text-amber-600 border-amber-200 bg-amber-50">{retentionImpact}%</Badge>
                </div>
                <Slider value={[retentionImpact]} onValueChange={([v]: number[]) => setRetentionImpact(v)} max={20} step={0.5} />
                <p className="text-[10px] text-muted-foreground italic">Impacto baseado em benchmark do setor para programas de premiação estruturados.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 rounded-2xl overflow-hidden relative min-h-[160px]">
            <Calculator className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
            <CardContent className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Investimento Estimado (Payout)</p>
              <h2 className="text-4xl font-bold mt-2 tracking-tighter">{formatCurrency(totalBudget)}</h2>
              <div className="mt-8 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-tighter">
                  <span>Impacto na Folha Anual</span>
                  <span>{((totalBudget / (employees * avgSalary * 13)) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.min((totalBudget / (employees * avgSalary * 13)) * 1000, 100)}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 rounded-2xl shadow-sm bg-gradient-to-br from-success/10 to-transparent border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-success">ROI Projetado em Retenção</p>
              </div>
              <h2 className="text-3xl font-bold text-success tracking-tighter">{roi.toFixed(2)}x</h2>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                Economia estimada de <strong>{formatCurrency(savings)}</strong> em custos de reposição e treinamento ao atingir a meta de retenção.
              </p>
            </CardContent>
          </Card>

          {scenarios.length > 0 && (
            <Card className="border-border/30 rounded-2xl shadow-sm bg-muted/30">
              <CardHeader className="p-4 pb-0 flex-row items-center gap-2 space-y-0">
                <History className="h-3 w-3 text-muted-foreground" />
                <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Comparações Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2">
                {scenarios.map(s => (
                  <div key={s.id} className="flex justify-between items-center text-xs p-2 bg-background rounded-lg border border-border/10">
                    <span className="font-medium">{s.timestamp}</span>
                    <span className="font-mono font-bold text-primary">{formatCurrency(s.totalBudget)}</span>
                    <Badge variant="outline" className="text-[9px] font-bold">{s.roi.toFixed(1)}x ROI</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}