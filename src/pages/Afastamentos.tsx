import { Plus, Heart, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockAfastamentos = [
  { id: '1', colaborador: 'Ana Souza', tipo: 'Atestado', icone: '🤒', dataInicio: '10/12/2025', dataFim: '12/12/2025', dias: 3, status: 'em_curso' },
  { id: '2', colaborador: 'Carlos Lima', tipo: 'Acidente Trabalho', icone: '🤕', dataInicio: '01/12/2025', dataFim: 'Indeterminado', dias: 16, status: 'inss' },
  { id: '3', colaborador: 'Maria Costa', tipo: 'Licença Maternidade', icone: '🤰', dataInicio: '15/11/2025', dataFim: '15/03/2026', dias: 120, status: 'em_curso' },
  { id: '4', colaborador: 'José Santos', tipo: 'Atestado', icone: '🤒', dataInicio: '05/12/2025', dataFim: '05/12/2025', dias: 1, status: 'retorno' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  em_curso: { label: 'Em Afastamento', bg: 'bg-loggi/10', text: 'text-loggi' },
  inss: { label: 'Encaminhado INSS', bg: 'bg-warning/10', text: 'text-warning' },
  retorno: { label: 'Retornou', bg: 'bg-success/10', text: 'text-success' },
};

export default function Afastamentos() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Afastamentos</h1>
          <p className="text-muted-foreground text-sm">Licenças, atestados e afastamentos</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Registro
        </Button>
      </div>

      {/* Alert INSS */}
      <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground">Atenção: Afastamento > 15 dias</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Carlos Lima - Acidente de Trabalho - 16 dias. Necessário encaminhamento ao INSS.
            </p>
            <Button size="sm" className="mt-3 gap-2">
              <FileText className="w-4 h-4" />
              Gerar Encaminhamento INSS
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Afastados Hoje</p>
          <p className="text-2xl font-bold text-foreground mt-1">2</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Este Mês</p>
          <p className="text-2xl font-bold text-foreground mt-1">4</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Licença Maternidade</p>
          <p className="text-2xl font-bold text-store mt-1">1</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Encaminhados INSS</p>
          <p className="text-2xl font-bold text-warning mt-1">1</p>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm text-foreground">Registros de Afastamento</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Colaborador</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Tipo</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Início</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Prev. Fim</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Dias</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockAfastamentos.map((item) => {
              const config = statusConfig[item.status];
              return (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-loggi/20 flex items-center justify-center">
                        <span>{item.icone}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.colaborador}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{item.tipo}</td>
                  <td className="p-4 text-sm text-center text-foreground">{item.dataInicio}</td>
                  <td className="p-4 text-sm text-center text-muted-foreground">{item.dataFim}</td>
                  <td className="p-4 text-sm text-center font-semibold text-foreground">{item.dias}</td>
                  <td className="p-4 text-center">
                    <Badge className={cn("border-0", config.bg, config.text)}>
                      {config.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
