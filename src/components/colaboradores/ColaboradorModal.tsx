import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Colaborador, statusColaboradorLabels } from '@/types/colaborador';
import { cn } from '@/lib/utils';
import { 
  User, 
  Briefcase, 
  Building2, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard,
  FileText,
  Umbrella,
  Clock,
  TrendingUp,
  Pencil,
  Trash2
} from 'lucide-react';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  ativo: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  inativo: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  ferias: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  afastado: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  desligado: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  pendente: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
};

interface ColaboradorModalProps {
  colaborador: Colaborador | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (colaborador: Colaborador) => void;
  onDelete?: (colaborador: Colaborador) => void;
}

export const ColaboradorModal = memo(function ColaboradorModal({ colaborador, open, onOpenChange, onEdit, onDelete }: ColaboradorModalProps) {
  if (!colaborador) return null;

  const colors = statusColors[colaborador.status] ?? statusColors.ativo;
  const dataAdmissao = colaborador.data_admissao ?? '';
  const tempoEmpresa = calcularTempoEmpresa(dataAdmissao);
  
  // Get cargo/departamento names
  const cargoNome = typeof colaborador.cargo === 'object' && colaborador.cargo 
    ? (colaborador.cargo as { nome?: string }).nome ?? '-' 
    : (colaborador.cargo ?? '-');
  const deptNome = typeof colaborador.departamento === 'object' && colaborador.departamento 
    ? (colaborador.departamento as { nome?: string }).nome ?? '-' 
    : (colaborador.departamento ?? '-');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-primary">
                {colaborador.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            
            {/* Header Info */}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {colaborador.nome}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{cargoNome}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("gap-1.5", colors.bg, colors.text, "border-0")}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                  {statusColaboradorLabels[colaborador.status] ?? colaborador.status}
                </Badge>
                {(colaborador as any).matricula && (
                  <Badge variant="outline" className="font-mono text-xs">
                    MAT: {(colaborador as any).matricula}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Dados Contratuais */}
          <Section title="Dados Contratuais" icon={Briefcase}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Cargo" value={cargoNome} />
              <InfoItem label="Departamento" value={deptNome} />
              <InfoItem label="Gestor" value={(colaborador as any).gestor || 'Não informado'} />
              <InfoItem label="Salário Base" value={formatCurrency(colaborador.salario ?? 0)} highlight />
              <InfoItem 
                label="Data Admissão" 
                value={dataAdmissao ? new Date(dataAdmissao).toLocaleDateString('pt-BR') : '-'} 
              />
              <InfoItem label="Tempo de Empresa" value={tempoEmpresa} />
            </div>
          </Section>

          <Separator />

          {/* Dados Pessoais */}
          <Section title="Dados Pessoais" icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="CPF" value={colaborador.cpf ? `***.***.***-${colaborador.cpf.slice(-2)}` : '-'} />
              <InfoItem label="RG" value={colaborador.rg || '-'} />
              <InfoItem label="Data Nascimento" value={colaborador.data_nascimento ? new Date(colaborador.data_nascimento).toLocaleDateString('pt-BR') : '-'} />
              <InfoItem label="Estado Civil" value={colaborador.estado_civil || '-'} />
            </div>
          </Section>

          <Separator />

          {/* Contato */}
          <Section title="Contato" icon={Phone}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem 
                label="Telefone" 
                value={colaborador.telefone || colaborador.celular || '-'} 
                icon={Phone}
              />
              <InfoItem 
                label="E-mail" 
                value={colaborador.email || '-'}
                icon={Mail}
              />
              <InfoItem 
                label="Endereço" 
                value={colaborador.cidade && colaborador.estado ? `${colaborador.cidade}, ${colaborador.estado}` : '-'}
                icon={MapPin}
                colSpan={2}
              />
            </div>
          </Section>

          <Separator />

          {/* Dados Bancários */}
          <Section title="Dados Bancários" icon={CreditCard}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Banco" value={colaborador.banco || '-'} />
              <InfoItem label="Agência" value={colaborador.agencia || '-'} />
              <InfoItem label="Conta" value={colaborador.conta ? `******-${colaborador.conta.slice(-1)}` : '-'} />
              <InfoItem label="PIX" value={colaborador.pix || '-'} />
            </div>
          </Section>

          <Separator />

          {/* Resumo Rápido */}
          <Section title="Resumo" icon={TrendingUp}>
            <div className="grid grid-cols-4 gap-3">
              <QuickStat 
                label="Férias" 
                value="30 dias" 
                subtext="saldo disponível" 
                icon={Umbrella}
                color="text-warning"
              />
              <QuickStat 
                label="Banco Horas" 
                value="+8:45" 
                subtext="saldo atual" 
                icon={Clock}
                color="text-success"
              />
              <QuickStat 
                label="Faltas" 
                value="2" 
                subtext="este ano" 
                icon={Calendar}
                color="text-destructive"
              />
              <QuickStat 
                label="Documentos" 
                value="12" 
                subtext="arquivados" 
                icon={FileText}
                color="text-info"
              />
            </div>
          </Section>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-border">
          <Button 
            variant="default" 
            className="gap-2"
            onClick={() => {
              onOpenChange(false);
              onEdit?.(colaborador);
            }}
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <FileText className="w-4 h-4" />
            Documentos
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Umbrella className="w-4 h-4" />
            Férias
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              onOpenChange(false);
              onDelete?.(colaborador);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

// Componentes auxiliares
function Section({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  icon: Icon, 
  highlight = false,
  colSpan = 1 
}: { 
  label: string; 
  value: string; 
  icon?: typeof User;
  highlight?: boolean;
  colSpan?: number;
}) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn(
        "text-sm flex items-center gap-1.5",
        highlight ? "font-semibold text-success" : "text-foreground"
      )}>
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
        {value}
      </p>
    </div>
  );
}

function QuickStat({ 
  label, 
  value, 
  subtext, 
  icon: Icon,
  color 
}: { 
  label: string; 
  value: string; 
  subtext: string;
  icon: typeof User;
  color: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/30 text-center">
      <Icon className={cn("w-4 h-4 mx-auto mb-1", color)} />
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{subtext}</p>
    </div>
  );
}

// Funções auxiliares
function calcularTempoEmpresa(dataAdmissao: string): string {
  if (!dataAdmissao) return '-';
  const admissao = new Date(dataAdmissao);
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - admissao.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const anos = Math.floor(diffDays / 365);
  const meses = Math.floor((diffDays % 365) / 30);
  
  if (anos > 0) {
    return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mes${meses !== 1 ? 'es' : ''}`;
  }
  return `${meses} mes${meses !== 1 ? 'es' : ''}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
}
