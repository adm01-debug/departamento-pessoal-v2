import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GRID_LABELS: Record<string, string> = {
  '1-3': 'Enigma', '2-3': 'Alto Potencial', '3-3': 'Estrela',
  '1-2': 'Dilema', '2-2': 'Core Player', '3-2': 'Alto Profissional',
  '1-1': 'Sub-performer', '2-1': 'Efetivo', '3-1': 'Profissional Confiável'
};

const GRID_COLORS: Record<string, string> = {
  '3-3': 'bg-green-100 border-green-500 text-green-700',
  '1-1': 'bg-red-100 border-red-500 text-red-700',
  '2-2': 'bg-blue-50 border-blue-400 text-blue-700',
  '1-3': 'bg-yellow-50 border-yellow-400 text-yellow-700',
  '3-1': 'bg-orange-50 border-orange-400 text-orange-700',
};

export function NineBoxMatrix({ data }: { data: any[] }) {
  const grid = useMemo(() => {
    const res: any = {};
    for (let p = 1; p <= 3; p++) {
      for (let t = 1; p <= 3; p++) {
        // res[`${p}-${t}`] = [];
      }
    }
    // Correct way:
    const buckets: any = {
      '1-1': [], '1-2': [], '1-3': [],
      '2-1': [], '2-2': [], '2-3': [],
      '3-1': [], '3-2': [], '3-3': []
    };

    data.forEach(item => {
      const perf = classifyScore(item.performance_avg);
      const pot = classifyScore(item.potencial_avg);
      const key = `${perf}-${pot}`;
      if (buckets[key]) buckets[key].push(item);
    });
    return buckets;
  }, [data]);

  function classifyScore(score: number) {
    if (score <= 1.5) return 1;
    if (score <= 2.5) return 2;
    return 3;
  }

  return (
    <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" /> Matriz Nine-Box
            </CardTitle>
            <CardDescription className="font-body text-xs">Análise de Potencial vs. Performance</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Eixo X: Performance (Baixa, Média, Alta)<br />
                Eixo Y: Potencial (Baixa, Média, Alta)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3 aspect-square max-w-[800px] mx-auto">
          {/* Loop from Potencial 3 to 1 (Rows) and Performance 1 to 3 (Cols) */}
          {[3, 2, 1].map(pot => (
            [1, 2, 3].map(perf => {
              const key = `${perf}-${pot}`;
              const employees = grid[key] || [];
              return (
                <div 
                  key={key} 
                  className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] shadow-sm ${GRID_COLORS[key] || 'bg-muted/30 border-border/30 text-muted-foreground'}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-tighter mb-1">{GRID_LABELS[key]}</p>
                  <p className="text-xl font-display font-black">{employees.length}</p>
                  <p className="text-[9px] opacity-70">colaboradores</p>
                  
                  {employees.length > 0 && (
                     <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {employees.slice(0, 3).map((e: any) => (
                          <div key={e.colaborador_id} className="h-5 w-5 rounded-full bg-white/50 border border-black/5 flex items-center justify-center text-[8px] font-bold" title={e.nome_completo}>
                            {e.nome_completo[0]}
                          </div>
                        ))}
                        {employees.length > 3 && <span className="text-[8px]">+ {employees.length - 3}</span>}
                     </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="p-3 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between">
              <span className="text-xs font-bold text-green-700">Top Talents (Estrelas)</span>
              <Badge className="bg-green-500">{grid['3-3']?.length || 0}</Badge>
           </div>
           <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700">Core Players</span>
              <Badge className="bg-blue-500">{grid['2-2']?.length || 0}</Badge>
           </div>
           <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-between">
              <span className="text-xs font-bold text-red-700">Underperformers</span>
              <Badge className="bg-red-500">{grid['1-1']?.length || 0}</Badge>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
