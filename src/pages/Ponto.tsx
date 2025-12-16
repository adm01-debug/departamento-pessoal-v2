import { useState } from 'react';
import { Clock, Calendar, Download, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockColaboradores } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Mock espelho de ponto
const mockEspelho = [
  { data: '01/12', dia: 'Seg', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '17:00', total: '8:00', status: 'ok' },
  { data: '02/12', dia: 'Ter', entrada1: '08:15', saida1: '12:00', entrada2: '13:00', saida2: '17:00', total: '7:45', status: 'atraso' },
  { data: '03/12', dia: 'Qua', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '18:30', total: '9:30', status: 'extra' },
  { data: '04/12', dia: 'Qui', entrada1: '--:--', saida1: '--:--', entrada2: '--:--', saida2: '--:--', total: '0:00', status: 'falta' },
  { data: '05/12', dia: 'Sex', entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '17:00', total: '8:00', status: 'ok' },
  { data: '06/12', dia: 'Sab', entrada1: '---', saida1: '---', entrada2: '---', saida2: '---', total: '---', status: 'dsr' },
  { data: '07/12', dia: 'Dom', entrada1: '---', saida1: '---', entrada2: '---', saida2: '---', total: '---', status: 'dsr' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; icon?: string }> = {
  ok: { label: 'OK', bg: 'bg-success/10', text: 'text-success', icon: '✅' },
  atraso: { label: 'Atraso', bg: 'bg-warning/10', text: 'text-warning', icon: '⚠️' },
  extra: { label: 'Extra', bg: 'bg-info/10', text: 'text-info', icon: '⏰' },
  falta: { label: 'Falta', bg: 'bg-destructive/10', text: 'text-destructive', icon: '❌' },
  dsr: { label: 'DSR', bg: 'bg-muted', text: 'text-muted-foreground', icon: '🔵' },
};

export default function Ponto() {
  const [colaborador, setColaborador] = useState(mockColaboradores[0].id);

  const selected = mockColaboradores.find(c => c.id === colaborador);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Controle de Ponto</h1>
          <p className="text-muted-foreground text-sm">Espelho de ponto e banco de horas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Fechar Período
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <Select value={colaborador} onValueChange={setColaborador}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione o colaborador" />
            </SelectTrigger>
            <SelectContent>
              {mockColaboradores.filter(c => c.status === 'ativo').map(c => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select defaultValue="12-2025">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12-2025">Dezembro/2025</SelectItem>
              <SelectItem value="11-2025">Novembro/2025</SelectItem>
              <SelectItem value="10-2025">Outubro/2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Horas Trabalhadas</p>
          <p className="text-2xl font-bold text-foreground mt-1">176:00</p>
          <p className="text-xs text-muted-foreground">de 176h</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Horas Extras</p>
          <p className="text-2xl font-bold text-info mt-1">12:30</p>
          <p className="text-xs text-muted-foreground">50%: 8h | 100%: 4h</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Banco de Horas</p>
          <p className="text-2xl font-bold text-success mt-1">+8:45</p>
          <p className="text-xs text-muted-foreground">saldo acumulado</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Faltas/Atrasos</p>
          <p className="text-2xl font-bold text-warning mt-1">2/3</p>
          <p className="text-xs text-muted-foreground">este mês</p>
        </div>
      </div>

      {/* Espelho de Ponto */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            Espelho de Ponto - {selected?.nome}
          </h3>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Período Aberto
          </Badge>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Data</th>
              <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Dia</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Entrada</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Almoço</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Retorno</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Saída</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Total</th>
              <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockEspelho.map((row, i) => {
              const config = statusConfig[row.status];
              return (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 text-sm font-medium text-foreground">{row.data}</td>
                  <td className="p-3 text-sm text-muted-foreground">{row.dia}</td>
                  <td className="p-3 text-sm text-center font-mono text-foreground">{row.entrada1}</td>
                  <td className="p-3 text-sm text-center font-mono text-foreground">{row.saida1}</td>
                  <td className="p-3 text-sm text-center font-mono text-foreground">{row.entrada2}</td>
                  <td className="p-3 text-sm text-center font-mono text-foreground">{row.saida2}</td>
                  <td className="p-3 text-sm text-center font-mono font-semibold text-foreground">{row.total}</td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0", config.bg, config.text)}>
                      {config.icon} {config.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ajustes Pendentes */}
      <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          Ajustes Pendentes (2)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border">
            <span className="text-sm font-medium">📝 02/12 - Atraso 15min</span>
            <span className="text-xs text-muted-foreground flex-1">Aguardando justificativa</span>
            <Button size="sm" variant="outline">Justificar</Button>
          </div>
          <div className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border">
            <span className="text-sm font-medium">📝 04/12 - Falta</span>
            <span className="text-xs text-muted-foreground flex-1">Aguardando atestado</span>
            <Button size="sm" variant="outline">Anexar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
