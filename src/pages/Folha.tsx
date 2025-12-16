import { Wallet, CheckCircle, Clock, FileText, Send, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const etapas = [
  { id: 'abertura', label: 'Competência aberta', data: '01/12', concluida: true },
  { id: 'variaveis', label: 'Variáveis coletadas', data: '05/12', concluida: true },
  { id: 'ponto', label: 'Ponto integrado', data: '10/12', concluida: true },
  { id: 'calculo', label: 'Cálculo em processamento', data: '-', concluida: false, atual: true },
  { id: 'conferencia', label: 'Conferência', data: '-', concluida: false },
  { id: 'aprovacao', label: 'Aprovação', data: '-', concluida: false },
  { id: 'esocial', label: 'Envio eSocial', data: '-', concluida: false },
  { id: 'pagamento', label: 'Pagamento (Até 05/01)', data: '-', concluida: false },
];

export default function Folha() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Folha de Pagamento</h1>
          <p className="text-muted-foreground text-sm">Processamento da folha mensal</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="12-2025">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12-2025">Dezembro/2025</SelectItem>
              <SelectItem value="11-2025">Novembro/2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <Badge className="bg-warning/10 text-warning border-0 px-3 py-1">
          <Clock className="w-3 h-3 mr-1" />
          Em Cálculo
        </Badge>
        <span className="text-sm text-muted-foreground">48 colaboradores</span>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase mb-1">Total Bruto</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(198500)}</p>
          <p className="text-xs text-muted-foreground mt-1">▲ 3% vs mês anterior</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase mb-1">Descontos</p>
          <p className="text-3xl font-bold text-destructive">{formatCurrency(43200)}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-muted-foreground">INSS: 22.500</span>
            <span className="text-xs text-muted-foreground">IRRF: 12.800</span>
            <span className="text-xs text-muted-foreground">VT: 4.900</span>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase mb-1">Total Líquido</p>
          <p className="text-3xl font-bold text-success">{formatCurrency(155300)}</p>
        </div>
      </div>

      {/* Encargos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground uppercase">FGTS</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(15880)}</p>
          <p className="text-xs text-muted-foreground">(8%)</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground uppercase">INSS Patronal</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(39700)}</p>
          <p className="text-xs text-muted-foreground">(20%)</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground uppercase">Provisões</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(28500)}</p>
          <p className="text-xs text-muted-foreground">13º + Férias</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-sm text-foreground mb-4">Etapas do Processamento</h3>
        <div className="space-y-3">
          {etapas.map((etapa, index) => (
            <div key={etapa.id} className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                etapa.concluida ? "bg-success text-success-foreground" :
                etapa.atual ? "bg-primary text-primary-foreground animate-pulse" :
                "bg-muted text-muted-foreground"
              )}>
                {etapa.concluida ? '✓' : etapa.atual ? '⟳' : index + 1}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm",
                  etapa.concluida ? "text-foreground" : 
                  etapa.atual ? "text-primary font-medium" :
                  "text-muted-foreground"
                )}>
                  {etapa.label}
                </p>
              </div>
              {etapa.data !== '-' && (
                <span className="text-xs text-muted-foreground">{etapa.data}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Ver Detalhes
        </Button>
        <Button variant="outline" className="gap-2">
          📊 Comparativo
        </Button>
        <Button variant="outline" className="gap-2">
          📥 Exportar
        </Button>
        <Button className="gap-2 ml-auto">
          <CheckCircle className="w-4 h-4" />
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
}
