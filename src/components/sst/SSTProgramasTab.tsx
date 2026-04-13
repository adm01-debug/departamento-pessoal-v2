import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PROGRAMAS_SST = [
  { sigla: 'PCMSO', nome: 'Programa de Controle Médico de Saúde Ocupacional', nr: 'NR-7', vigencia: '12 meses', responsavel: 'Médico do Trabalho' },
  { sigla: 'PGR', nome: 'Programa de Gerenciamento de Riscos', nr: 'NR-1/NR-9', vigencia: '24 meses', responsavel: 'Engenheiro de Segurança' },
  { sigla: 'LTCAT', nome: 'Laudo Técnico das Condições Ambientais', nr: 'NR-15/16', vigencia: 'Até alteração', responsavel: 'Engenheiro de Segurança' },
  { sigla: 'PPP', nome: 'Perfil Profissiográfico Previdenciário', nr: 'IN 128', vigencia: 'Permanente', responsavel: 'RH / SST' },
  { sigla: 'CIPA', nome: 'Comissão Interna de Prevenção de Acidentes', nr: 'NR-5', vigencia: '12 meses', responsavel: 'Eleitos + Indicados' },
  { sigla: 'AET', nome: 'Análise Ergonômica do Trabalho', nr: 'NR-17', vigencia: '24 meses', responsavel: 'Ergonomista' },
];

export function SSTProgramasTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROGRAMAS_SST.map((prog, i) => (
          <motion.div key={prog.sigla} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="border-border/30 rounded-2xl hover:shadow-elevated transition-all overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-success to-info" />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-success to-info">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-sm">{prog.sigla}</p>
                      <Badge variant="outline" className="text-[10px] font-body">{prog.nr}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-body truncate">{prog.nome}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-body"><span className="text-muted-foreground">Vigência:</span><span className="font-medium">{prog.vigencia}</span></div>
                  <div className="flex justify-between text-[10px] font-body"><span className="text-muted-foreground">Responsável:</span><span className="font-medium">{prog.responsavel}</span></div>
                  <div className="flex justify-between text-[10px] font-body"><span className="text-muted-foreground">Status:</span><Badge className="bg-success/15 text-success border-0 text-[9px]">Vigente</Badge></div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/20 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-[10px] h-7 rounded-lg font-body">Visualizar</Button>
                  <Button size="sm" variant="outline" className="flex-1 text-[10px] h-7 rounded-lg font-body">Renovar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk Matrix */}
      <Card className="rounded-2xl border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />Matriz de Risco (Probabilidade × Severidade)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr>
                  <th className="p-2 text-left text-muted-foreground">Prob. \ Sev.</th>
                  {['Insignificante', 'Menor', 'Moderada', 'Maior', 'Catastrófica'].map(s => (
                    <th key={s} className="p-2 text-center text-muted-foreground">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Muito Alta', 'Alta', 'Média', 'Baixa', 'Muito Baixa'].map((prob, pi) => (
                  <tr key={prob}>
                    <td className="p-2 font-medium">{prob}</td>
                    {[5, 4, 3, 2, 1].map((sev, si) => {
                      const score = (5 - pi) * sev;
                      const bg = score >= 20 ? 'bg-destructive/20 text-destructive' : score >= 12 ? 'bg-warning/20 text-warning' : score >= 6 ? 'bg-info/20 text-info' : 'bg-success/20 text-success';
                      return <td key={si} className="p-1 text-center"><div className={cn("rounded-lg p-1.5 font-semibold", bg)}>{score}</div></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3 text-[10px] font-body">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-destructive/20" />Intolerável (≥20)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-warning/20" />Substancial (12-19)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-info/20" />Moderado (6-11)</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-success/20" />Trivial (1-5)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
