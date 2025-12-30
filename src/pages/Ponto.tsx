import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { Clock, Calendar, Download, CheckCircle, AlertTriangle, User, Plus, Save, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useColaboradores } from '@/hooks/useColaboradores';
import { usePonto } from '@/hooks/usePonto';
import { useIntegracaoPontoFolha } from '@/hooks/useIntegracaoPontoFolha';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { TipoDia, RegistroPonto } from '@/types/ponto';

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  ok: { label: 'OK', bg: 'bg-success/10', text: 'text-success', icon: '✅' },
  atraso: { label: 'Atraso', bg: 'bg-warning/10', text: 'text-warning', icon: '⚠️' },
  extra: { label: 'Extra', bg: 'bg-info/10', text: 'text-info', icon: '⏰' },
  falta: { label: 'Falta', bg: 'bg-destructive/10', text: 'text-destructive', icon: '❌' },
  dsr: { label: 'DSR', bg: 'bg-muted', text: 'text-muted-foreground', icon: '🔵' },
  feriado: { label: 'Feriado', bg: 'bg-primary/10', text: 'text-primary', icon: '🎉' },
  ferias: { label: 'Férias', bg: 'bg-info/10', text: 'text-info', icon: '🏖️' },
  atestado: { label: 'Atestado', bg: 'bg-warning/10', text: 'text-warning', icon: '🏥' },
};

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default memo(function Ponto() {
  useEffect(() => { document.title = 'Ponto Eletrônico | DP System'; }, []);

  const [colaboradorId, setColaboradorId] = useState<string>('');
  const [competencia, setCompetencia] = useState(format(new Date(), 'yyyy-MM'));
  const [registroEditando, setRegistroEditando] = useState<Partial<RegistroPonto> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { colaboradores, loading: loadingColaboradores } = useColaboradores();
  const { useRegistrosPonto, useFeriados, calcularResumoMensal, registrarPonto, isRegistrando } = usePonto();
  const { exportarParaFolha, isExportando } = useIntegracaoPontoFolha();

  const colaboradoresAtivos = colaboradores?.filter(c => c.status === 'ativo') ?? [];
  const colaboradorSelecionado = colaboradoresAtivos.find(c => c.id === colaboradorId);

  const [ano, mes] = competencia.split('-').map(Number);
  const dataInicio = format(startOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');
  const dataFim = format(endOfMonth(new Date(ano, mes - 1)), 'yyyy-MM-dd');

  const { data: registros, isLoading: loadingRegistros } = useRegistrosPonto(colaboradorId, dataInicio, dataFim);
  const { data: feriados } = useFeriados(ano);

  // Gerar dias do mês
  const diasDoMes = useMemo(() => {
    const inicio = startOfMonth(new Date(ano, mes - 1));
    const fim = endOfMonth(new Date(ano, mes - 1));
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [ano, mes]);

  // Mapear registros por data
  const registrosPorData = useMemo(() => {
    const map = new Map<string, RegistroPonto>();
    registros?.forEach(r => map.set(r.data, r));
    return map;
  }, [registros]);

  // Mapear feriados por data
  const feriadosPorData = useMemo(() => {
    const map = new Map<string, string>();
    feriados?.forEach(f => map.set(f.data, f.descricao));
    return map;
  }, [feriados]);

  // Calcular resumo
  const resumo = useMemo(() => {
    if (!registros) return null;
    return calcularResumoMensal(registros, colaboradorSelecionado?.jornada_semanal || 44);
  }, [registros, colaboradorSelecionado]);

  // Determinar status do registro
  const getStatus = (data: Date, registro?: RegistroPonto) => {
    const dataStr = format(data, 'yyyy-MM-dd');
    const diaSemana = getDay(data);
    
    // Domingo
    if (diaSemana === 0) return 'dsr';
    
    // Feriado
    if (feriadosPorData.has(dataStr)) return 'feriado';
    
    if (!registro) {
      // Dia futuro ou sem registro
      if (data > new Date()) return 'dsr';
      return diaSemana === 6 ? 'dsr' : 'falta';
    }
    
    if (registro.tipo_dia === 'ferias') return 'ferias';
    if (registro.tipo_dia === 'atestado') return 'atestado';
    if (registro.tipo_dia === 'falta') return 'falta';
    
    // Verificar extras
    const extras = registro.horas_extras?.match(/(\d+):(\d+)/);
    if (extras && (parseInt(extras[1]) > 0 || parseInt(extras[2]) > 0)) {
      return 'extra';
    }
    
    // Verificar atrasos/faltas
    const falta = registro.horas_falta?.match(/(\d+):(\d+)/);
    if (falta && (parseInt(falta[1]) > 0 || parseInt(falta[2]) > 0)) {
      return 'atraso';
    }
    
    return 'ok';
  };

  const handleNovoRegistro = (data: Date) => {
    if (!colaboradorId) {
      toast.error('Selecione um colaborador primeiro');
      return;
    }
    
    const dataStr = format(data, 'yyyy-MM-dd');
    const registroExistente = registrosPorData.get(dataStr);
    
    setRegistroEditando({
      colaborador_id: colaboradorId,
      data: dataStr,
      entrada_1: registroExistente?.entrada_1 ?? '',
      saida_1: registroExistente?.saida_1 ?? '',
      entrada_2: registroExistente?.entrada_2 ?? '',
      saida_2: registroExistente?.saida_2 ?? '',
      tipo_dia: registroExistente?.tipo_dia || 'normal',
      justificativa: registroExistente?.justificativa ?? '',
      observacoes: registroExistente?.observacoes ?? ''
    });
    setDialogOpen(true);
  };

  const handleSalvarRegistro = () => {
    if (!registroEditando) return;
    
    registrarPonto({
      colaborador_id: registroEditando.colaborador_id!,
      data: registroEditando.data!,
      entrada_1: registroEditando.entrada_1 || null,
      saida_1: registroEditando.saida_1 || null,
      entrada_2: registroEditando.entrada_2 || null,
      saida_2: registroEditando.saida_2 || null,
      entrada_3: null,
      saida_3: null,
      tipo_dia: (registroEditando.tipo_dia as TipoDia) || 'normal',
      justificativa: registroEditando.justificativa || null,
      observacoes: registroEditando.observacoes || null,
      aprovado: false,
      aprovado_por: null,
      aprovado_em: null,
      created_by: null,
      horas_trabalhadas: null,
      horas_extras: null,
      horas_falta: null
    });
    
    setDialogOpen(false);
    setRegistroEditando(null);
  };

  // Gerar competências disponíveis
  const competencias = useMemo(() => {
    const lista = [];
    const hoje = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      lista.push({
        value: format(d, 'yyyy-MM'),
        label: format(d, 'MMMM/yyyy', { locale: ptBR })
      });
    }
    return lista;
  }, []);

  return (
    <>
      <SEOHead title="Ponto | DP System" description="Gestão de ponto e jornada de trabalho" />
    <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Controle de Ponto</h1>
          <p className="text-muted-foreground text-sm">Espelho de ponto e banco de horas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => exportarParaFolha(competencia)}
            disabled={isExportando}
          >
            {isExportando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isExportando ? 'Exportando...' : 'Exportar p/ Folha'}
          </Button>
          <Button aria-label="Ação" variant="outline" className="gap-2">
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
          <Select value={colaboradorId} onValueChange={setColaboradorId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione o colaborador" />
            </SelectTrigger>
            <SelectContent>
              {colaboradoresAtivos.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={competencia} onValueChange={setCompetencia}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {competencias.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Horas Trabalhadas</p>
          <p className="text-2xl font-bold text-foreground mt-1">{resumo?.horas_trabalhadas || '00:00'}</p>
          <p className="text-xs text-muted-foreground">de {resumo?.horas_previstas || '00:00'}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Horas Extras</p>
          <p className="text-2xl font-bold text-info mt-1">
            {resumo ? `${resumo.horas_extras_50}` : '00:00'}
          </p>
          <p className="text-xs text-muted-foreground">
            50%: {resumo?.horas_extras_50 || '0h'} | 100%: {resumo?.horas_extras_100 || '0h'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Banco de Horas</p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            resumo?.saldo_banco_horas?.startsWith('-') ? 'text-destructive' : 'text-success'
          )}>
            {resumo?.saldo_banco_horas?.startsWith('-') ? '' : '+'}{resumo?.saldo_banco_horas || '00:00'}
          </p>
          <p className="text-xs text-muted-foreground">saldo acumulado</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Dias Trabalhados</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {resumo?.dias_trabalhados ?? 0}/{resumo?.dias_uteis ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">este mês</p>
        </div>
      </div>

      {/* Espelho de Ponto */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            Espelho de Ponto - {colaboradorSelecionado?.nome_completo || 'Selecione um colaborador'}
          </h3>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Período Aberto
          </Badge>
        </div>
        
        {!colaboradorId ? (
          <div className="p-8 text-center text-muted-foreground">
            Selecione um colaborador para visualizar o espelho de ponto
          </div>
        ) : loadingRegistros ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando registros...
          </div>
        ) : (
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
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diasDoMes.map((data) => {
                const dataStr = format(data, 'yyyy-MM-dd');
                const registro = registrosPorData.get(dataStr);
                const status = getStatus(data, registro);
                const config = statusConfig[status];
                const feriado = feriadosPorData.get(dataStr);
                
                return (
                  <tr key={dataStr} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-sm font-medium text-foreground">
                      {format(data, 'dd/MM')}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {diasSemana[getDay(data)]}
                    </td>
                    <td className="p-3 text-sm text-center font-mono text-foreground">
                      {registro?.entrada_1 || '--:--'}
                    </td>
                    <td className="p-3 text-sm text-center font-mono text-foreground">
                      {registro?.saida_1 || '--:--'}
                    </td>
                    <td className="p-3 text-sm text-center font-mono text-foreground">
                      {registro?.entrada_2 || '--:--'}
                    </td>
                    <td className="p-3 text-sm text-center font-mono text-foreground">
                      {registro?.saida_2 || '--:--'}
                    </td>
                    <td className="p-3 text-sm text-center font-mono font-semibold text-foreground">
                      {registro?.horas_trabalhadas?.substring(0, 5) || '00:00'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={cn("border-0", config.bg, config.text)} title={feriado}>
                        {config.icon} {config.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleNovoRegistro(data)}
                        disabled={status === 'dsr' && getDay(data) === 0}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog de Registro */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Registrar Ponto - {registroEditando?.data && format(parseISO(registroEditando.data), 'dd/MM/yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Entrada</Label>
                <Input
                  type="time"
                  value={registroEditando?.entrada_1 ?? ''}
                  onChange={e => setRegistroEditando(prev => prev ? { ...prev, entrada_1: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Almoço</Label>
                <Input
                  type="time"
                  value={registroEditando?.saida_1 ?? ''}
                  onChange={e => setRegistroEditando(prev => prev ? { ...prev, saida_1: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Retorno</Label>
                <Input
                  type="time"
                  value={registroEditando?.entrada_2 ?? ''}
                  onChange={e => setRegistroEditando(prev => prev ? { ...prev, entrada_2: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Saída</Label>
                <Input
                  type="time"
                  value={registroEditando?.saida_2 ?? ''}
                  onChange={e => setRegistroEditando(prev => prev ? { ...prev, saida_2: e.target.value } : null)}
                />
              </div>
            </div>
            
            <div>
              <Label>Tipo do Dia</Label>
              <Select 
                value={registroEditando?.tipo_dia || 'normal'}
                onValueChange={v => setRegistroEditando(prev => prev ? { ...prev, tipo_dia: v as TipoDia } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="feriado">Feriado</SelectItem>
                  <SelectItem value="compensado">Compensado</SelectItem>
                  <SelectItem value="folga">Folga</SelectItem>
                  <SelectItem value="falta">Falta</SelectItem>
                  <SelectItem value="atestado">Atestado</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="licenca">Licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Observações</Label>
              <Textarea
                value={registroEditando?.observacoes ?? ''}
                onChange={e => setRegistroEditando(prev => prev ? { ...prev, observacoes: e.target.value } : null)}
                placeholder="Observações opcionais..."
              />
            </div>
            
            <Button 
              onClick={handleSalvarRegistro} 
              className="w-full gap-2"
              disabled={isRegistrando}
            >
              <Save className="w-4 h-4" />
              {isRegistrando ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-muted/30">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <Badge className={cn("border-0 text-xs", config.bg, config.text)}>
              {config.icon}
            </Badge>
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
