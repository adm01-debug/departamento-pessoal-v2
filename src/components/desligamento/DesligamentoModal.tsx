import { useState, memo, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, User, AlertTriangle, Calculator } from 'lucide-react';
import { format, differenceInDays, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useColaboradores } from '@/hooks/useColaboradores';

interface DesligamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NovoDesligamentoData) => void;
}

export type TipoDesligamento = 
  | 'sem_justa_causa'
  | 'justa_causa'
  | 'pedido_demissao'
  | 'acordo_mutuo';

export interface NovoDesligamentoData {
  colaboradorId: string;
  tipoDesligamento: TipoDesligamento;
  dataDesligamento: Date;
  dataAvisoPrevio?: Date;
  avisoPrevioTrabalhado: boolean;
  motivoDetalhado?: string;
  calculoRescisao: CalculoRescisao;
}

export interface CalculoRescisao {
  saldoSalario: number;
  avisoPrevio: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoFerias: number;
  decimoTerceiro: number;
  multaFgts: number;
  totalProventos: number;
  inss: number;
  irrf: number;
  adiantamentos: number;
  totalDescontos: number;
  totalLiquido: number;
}

const tiposDesligamentoInfo: Record<TipoDesligamento, { label: string; description: string; color: string }> = {
  sem_justa_causa: {
    label: 'Dispensa sem Justa Causa',
    description: 'Colaborador recebe todas as verbas rescisórias + multa 40% FGTS',
    color: 'bg-warning/20 text-warning',
  },
  justa_causa: {
    label: 'Dispensa por Justa Causa',
    description: 'Colaborador perde direito a aviso prévio, 13º proporcional e multa FGTS',
    color: 'bg-destructive/20 text-destructive',
  },
  pedido_demissao: {
    label: 'Pedido de Demissão',
    description: 'Colaborador pede desligamento, sem direito à multa FGTS',
    color: 'bg-info/20 text-info',
  },
  acordo_mutuo: {
    label: 'Acordo Mútuo (Art. 484-A)',
    description: 'Multa FGTS de 20% + metade do aviso prévio indenizado',
    color: 'bg-primary/20 text-primary',
  },
};

export const DesligamentoModal = memo(function DesligamentoModal({ open, onOpenChange, onSubmit }: DesligamentoModalProps) {
  const [colaboradorId, setColaboradorId] = useState<string>('');
  const [tipoDesligamento, setTipoDesligamento] = useState<TipoDesligamento | ''>('');
  const [dataDesligamento, setDataDesligamento] = useState<Date>();
  const [avisoPrevioTrabalhado, setAvisoPrevioTrabalhado] = useState(false);
  const [motivoDetalhado, setMotivoDetalhado] = useState('');
  const [dateOpen, setDateOpen] = useState(false);

  const { colaboradores } = useColaboradores();
  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo');
  const colaboradorSelecionado = colaboradoresAtivos.find(c => c.id === colaboradorId);

  const calculo = useMemo<CalculoRescisao | null>(() => {
    if (!colaboradorSelecionado || !tipoDesligamento || !dataDesligamento) return null;

    const salario = colaboradorSelecionado.salario_base;
    const dataAdmissao = new Date(colaboradorSelecionado.data_admissao);
    const diasTrabalhados = differenceInDays(dataDesligamento, new Date(dataDesligamento.getFullYear(), dataDesligamento.getMonth(), 1)) + 1;
    const mesesTrabalhados = differenceInMonths(dataDesligamento, dataAdmissao);
    const mesesAno = dataDesligamento.getMonth() + 1;

    // Saldo de salário
    const saldoSalario = (salario / 30) * diasTrabalhados;

    // Aviso prévio (30 dias + 3 dias por ano de serviço, máx 90 dias)
    const anosServico = Math.floor(mesesTrabalhados / 12);
    const diasAvisoPrevio = Math.min(30 + (anosServico * 3), 90);
    let avisoPrevio = 0;
    if (tipoDesligamento === 'sem_justa_causa') {
      avisoPrevio = avisoPrevioTrabalhado ? 0 : (salario / 30) * diasAvisoPrevio;
    } else if (tipoDesligamento === 'acordo_mutuo') {
      avisoPrevio = avisoPrevioTrabalhado ? 0 : ((salario / 30) * diasAvisoPrevio) / 2;
    }

    // Férias vencidas (simulação - 1 período vencido)
    const feriasVencidas = mesesTrabalhados >= 12 ? salario : 0;

    // Férias proporcionais
    const mesesFerias = mesesTrabalhados % 12;
    const feriasProporcionais = tipoDesligamento === 'justa_causa' ? 0 : (salario / 12) * mesesFerias;

    // 1/3 constitucional
    const tercoFerias = (feriasVencidas + feriasProporcionais) / 3;

    // 13º proporcional
    const decimoTerceiro = tipoDesligamento === 'justa_causa' ? 0 : (salario / 12) * mesesAno;

    // Multa FGTS (8% do salário por mês trabalhado)
    const baseFgts = salario * mesesTrabalhados * 0.08;
    let multaFgts = 0;
    if (tipoDesligamento === 'sem_justa_causa') {
      multaFgts = baseFgts * 0.4;
    } else if (tipoDesligamento === 'acordo_mutuo') {
      multaFgts = baseFgts * 0.2;
    }

    const totalProventos = saldoSalario + avisoPrevio + feriasVencidas + feriasProporcionais + tercoFerias + decimoTerceiro + multaFgts;

    // Descontos
    const baseInss = saldoSalario;
    let inss = 0;
    if (baseInss <= 1412) inss = baseInss * 0.075;
    else if (baseInss <= 2666.68) inss = baseInss * 0.09;
    else if (baseInss <= 4000.03) inss = baseInss * 0.12;
    else inss = baseInss * 0.14;
    inss = Math.min(inss, 908.85);

    const baseIrrf = saldoSalario - inss;
    let irrf = 0;
    if (baseIrrf > 4664.68) irrf = (baseIrrf * 0.275) - 896.00;
    else if (baseIrrf > 3751.05) irrf = (baseIrrf * 0.225) - 662.77;
    else if (baseIrrf > 2826.65) irrf = (baseIrrf * 0.15) - 381.44;
    else if (baseIrrf > 2259.20) irrf = (baseIrrf * 0.075) - 169.44;
    irrf = Math.max(0, irrf);

    const adiantamentos = 0; // Simulação

    const totalDescontos = inss + irrf + adiantamentos;
    const totalLiquido = totalProventos - totalDescontos;

    return {
      saldoSalario,
      avisoPrevio,
      feriasVencidas,
      feriasProporcionais,
      tercoFerias,
      decimoTerceiro,
      multaFgts,
      totalProventos,
      inss,
      irrf,
      adiantamentos,
      totalDescontos,
      totalLiquido,
    };
  }, [colaboradorSelecionado, tipoDesligamento, dataDesligamento, avisoPrevioTrabalhado]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!colaboradorId || !tipoDesligamento || !dataDesligamento || !calculo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      colaboradorId,
      tipoDesligamento,
      dataDesligamento,
      avisoPrevioTrabalhado,
      motivoDetalhado,
      calculoRescisao: calculo,
    });

    // Reset form
    setColaboradorId('');
    setTipoDesligamento('');
    setDataDesligamento(undefined);
    setAvisoPrevioTrabalhado(false);
    setMotivoDetalhado('');
    onOpenChange(false);
    toast.success('Desligamento iniciado com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Novo Desligamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Colaborador */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>
                  Colaborador <span className="text-destructive">*</span>
                </Label>
                <Select value={colaboradorId} onValueChange={setColaboradorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradoresAtivos.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{col.nome_completo}</span>
                          <span className="text-muted-foreground">• {col.cargo}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {colaboradorSelecionado && (
                <div className="col-span-2 p-3 rounded-lg bg-muted/50 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground">Matrícula:</span>{' '}
                      <span className="font-medium">{colaboradorSelecionado.matricula || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Departamento:</span>{' '}
                      <span className="font-medium">{colaboradorSelecionado.departamento}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Salário:</span>{' '}
                      <span className="font-medium">{formatCurrency(colaboradorSelecionado.salario_base)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tipo de Desligamento */}
          <div className="space-y-4">
            <Label>
              Tipo de Desligamento <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(tiposDesligamentoInfo) as [TipoDesligamento, typeof tiposDesligamentoInfo[TipoDesligamento]][]).map(
                ([tipo, info]) => (
                  <div
                    key={tipo}
                    onClick={() => setTipoDesligamento(tipo)}
                    className={cn(
                      "p-3 rounded-lg border-2 cursor-pointer transition-all",
                      tipoDesligamento === tipo
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn("px-2 py-0.5 rounded text-xs font-medium", info.color)}>
                        {info.label}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{info.description}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Data e Aviso */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Data do Desligamento <span className="text-destructive">*</span>
              </Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button aria-label="Ação"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataDesligamento && "text-muted-foreground"
                    )}
                  ><CalendarIcon className="mr-2 h-4 w-4" />
                    {dataDesligamento
                      ? format(dataDesligamento, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataDesligamento}
                    onSelect={(date) => {
                      setDataDesligamento(date);
                      setDateOpen(false);
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="avisoPrevio"
                  checked={avisoPrevioTrabalhado}
                  onCheckedChange={(checked) => setAvisoPrevioTrabalhado(!!checked)}
                />
                <Label htmlFor="avisoPrevio" className="cursor-pointer">
                  Aviso prévio trabalhado
                </Label>
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <Label htmlFor="motivo">Motivo Detalhado</Label>
            <Textarea
              id="motivo"
              placeholder="Descreva o motivo do desligamento..."
              rows={2}
              value={motivoDetalhado}
              onChange={(e) => setMotivoDetalhado(e.target.value)}
            />
          </div>

          {/* Cálculo de Rescisão */}
          {calculo && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Prévia do Cálculo de Rescisão</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Proventos */}
                  <div className="space-y-2 p-3 rounded-lg bg-success/5 border border-success/20">
                    <h5 className="text-sm font-medium text-success">Proventos</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saldo de Salário</span>
                        <span>{formatCurrency(calculo.saldoSalario)}</span>
                      </div>
                      {calculo.avisoPrevio > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aviso Prévio Indenizado</span>
                          <span>{formatCurrency(calculo.avisoPrevio)}</span>
                        </div>
                      )}
                      {calculo.feriasVencidas > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Férias Vencidas</span>
                          <span>{formatCurrency(calculo.feriasVencidas)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Férias Proporcionais</span>
                        <span>{formatCurrency(calculo.feriasProporcionais)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">1/3 Constitucional</span>
                        <span>{formatCurrency(calculo.tercoFerias)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">13º Proporcional</span>
                        <span>{formatCurrency(calculo.decimoTerceiro)}</span>
                      </div>
                      {calculo.multaFgts > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Multa FGTS</span>
                          <span>{formatCurrency(calculo.multaFgts)}</span>
                        </div>
                      )}
                      <Separator className="my-1" />
                      <div className="flex justify-between font-medium">
                        <span>Total Proventos</span>
                        <span className="text-success">{formatCurrency(calculo.totalProventos)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Descontos */}
                  <div className="space-y-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h5 className="text-sm font-medium text-destructive">Descontos</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">INSS</span>
                        <span>{formatCurrency(calculo.inss)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IRRF</span>
                        <span>{formatCurrency(calculo.irrf)}</span>
                      </div>
                      {calculo.adiantamentos > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Adiantamentos</span>
                          <span>{formatCurrency(calculo.adiantamentos)}</span>
                        </div>
                      )}
                      <Separator className="my-1" />
                      <div className="flex justify-between font-medium">
                        <span>Total Descontos</span>
                        <span className="text-destructive">{formatCurrency(calculo.totalDescontos)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Líquido */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Valor Líquido a Pagar</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(calculo.totalLiquido)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={!calculo}>
              Iniciar Desligamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
