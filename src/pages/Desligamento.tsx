import { Plus, UserMinus, FileText, Calculator, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockDesligamento = {
  colaborador: 'João Silva Santos',
  matricula: '001-2024',
  cargo: 'Operador de Produção',
  departamento: 'Gravação',
  dataAdmissao: '15/01/2024',
  tempoCasa: '11 meses',
  salario: 3500,
  tipoDesligamento: 'Dispensa sem Justa Causa',
  dataAviso: '10/12/2025',
  dataDesligamento: '09/01/2026',
  avisoTipo: 'Trabalhado (30 dias)',
  motivo: 'Redução de quadro',
};

const calculoRescisao = {
  saldoSalario: 1050,
  avisoPrevio: 0,
  decimoTerceiro: 3208.33,
  feriasProporcionais: 3208.33,
  tercoFerias: 1069.44,
  totalProventos: 8536.10,
  inss: 683.28,
  irrf: 228.50,
  valeTransporte: 105,
  totalDescontos: 1016.78,
  liquidoRescisao: 7519.32,
  fgtsMulta: 4666.67,
  totalReceber: 12185.99,
};

const checklist = [
  { id: 1, label: 'Comunicação formal recebida', concluido: true },
  { id: 2, label: 'Aviso prévio definido', concluido: true },
  { id: 3, label: 'Exame demissional agendado (05/01/2026)', concluido: true },
  { id: 4, label: 'Cálculo rescisório em revisão', concluido: false, atual: true },
  { id: 5, label: 'Envio S-2299 ao eSocial', concluido: false },
  { id: 6, label: 'Pagamento das verbas', concluido: false },
  { id: 7, label: 'Guias FGTS geradas', concluido: false },
  { id: 8, label: 'Homologação (se > 1 ano)', concluido: false },
  { id: 9, label: 'Entrega de documentos', concluido: false },
];

export default function Desligamento() {
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
          <h1 className="text-2xl font-display font-bold text-foreground">Desligamento</h1>
          <p className="text-muted-foreground text-sm">Processo de rescisão contratual</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Desligamento
        </Button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        <Badge className="bg-warning/10 text-warning border-0 px-3 py-1">
          <Calculator className="w-3 h-3 mr-1" />
          Cálculo de Rescisão
        </Badge>
        <span className="text-sm text-muted-foreground">Prazo: 8 dias</span>
      </div>

      {/* Dados do Desligamento */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-sm text-foreground mb-4">Dados do Desligamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Colaborador</p>
            <p className="text-sm font-medium text-foreground">{mockDesligamento.colaborador}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Matrícula</p>
            <p className="text-sm font-mono text-foreground">{mockDesligamento.matricula}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data Admissão</p>
            <p className="text-sm text-foreground">{mockDesligamento.dataAdmissao}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tempo de Casa</p>
            <p className="text-sm text-foreground">{mockDesligamento.tempoCasa}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tipo Desligamento</p>
            <p className="text-sm font-medium text-destructive">{mockDesligamento.tipoDesligamento}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data Aviso</p>
            <p className="text-sm text-foreground">{mockDesligamento.dataAviso}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data Desligamento</p>
            <p className="text-sm font-medium text-foreground">{mockDesligamento.dataDesligamento}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Aviso Prévio</p>
            <p className="text-sm text-foreground">{mockDesligamento.avisoTipo}</p>
          </div>
        </div>
      </div>

      {/* Cálculo da Rescisão */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-sm text-foreground mb-4">Cálculo da Rescisão</h3>
          
          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Verbas Rescisórias (Proventos)</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Saldo de Salário (9 dias)</span>
              <span className="text-foreground">{formatCurrency(calculoRescisao.saldoSalario)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">13º Proporcional (11/12)</span>
              <span className="text-foreground">{formatCurrency(calculoRescisao.decimoTerceiro)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Férias Proporcionais (11/12)</span>
              <span className="text-foreground">{formatCurrency(calculoRescisao.feriasProporcionais)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">1/3 Férias</span>
              <span className="text-foreground">{formatCurrency(calculoRescisao.tercoFerias)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
              <span>Total Proventos</span>
              <span className="text-success">{formatCurrency(calculoRescisao.totalProventos)}</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Descontos</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">INSS</span>
              <span className="text-destructive">{formatCurrency(calculoRescisao.inss)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IRRF</span>
              <span className="text-destructive">{formatCurrency(calculoRescisao.irrf)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vale Transporte</span>
              <span className="text-destructive">{formatCurrency(calculoRescisao.valeTransporte)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-2">
              <span>Total Descontos</span>
              <span className="text-destructive">{formatCurrency(calculoRescisao.totalDescontos)}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Valor Líquido Rescisão</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculoRescisao.liquidoRescisao)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground">FGTS + Multa 40%</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculoRescisao.fgtsMulta)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
              <span>TOTAL A RECEBER</span>
              <span className="text-success">{formatCurrency(calculoRescisao.totalReceber)}</span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-sm text-foreground mb-4">Checklist de Desligamento</h3>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0",
                  item.concluido ? "bg-success text-success-foreground" :
                  item.atual ? "bg-warning text-warning-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {item.concluido ? '✓' : item.atual ? '⟳' : ''}
                </div>
                <span className={cn(
                  "text-sm",
                  item.concluido ? "text-muted-foreground line-through" :
                  item.atual ? "text-foreground font-medium" :
                  "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Gerar TRCT
        </Button>
        <Button variant="outline" className="gap-2">
          📊 Simular Cálculo
        </Button>
        <Button className="gap-2 ml-auto">
          <CheckCircle className="w-4 h-4" />
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
}
