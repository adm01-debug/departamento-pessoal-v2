import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useMemo, useCallback } from 'react';
import { Plus, AlertTriangle, Calendar, FileText, CheckCircle, XCircle, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useAfastamentos } from '@/hooks/useAfastamentos';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  TipoAfastamento, 
  StatusAfastamento,
  tipoAfastamentoLabels, 
  tipoAfastamentoIcons,
  statusAfastamentoLabels,
  statusAfastamentoColors
} from '@/types/afastamento';

const Afastamentos = memo(function Afastamentos() {
  useEffect(() => {
    document.title = 'Afastamentos | DP System';
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [prorrogaDialogOpen, setProrrogaDialogOpen] = useState(false);
  const [selectedAfastamentoId, setSelectedAfastamentoId] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<StatusAfastamento | 'todos'>('todos');
  const [filtroTipo, setFiltroTipo] = useState<TipoAfastamento | 'todos'>('todos');
  const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear());

  // Form state
  const [formColaboradorId, setFormColaboradorId] = useState('');
  const [formTipo, setFormTipo] = useState<TipoAfastamento>('doenca');
  const [formDataInicio, setFormDataInicio] = useState('');
  const [formDataFim, setFormDataFim] = useState('');
  const [formCID, setFormCID] = useState('');
  const [formCIDDesc, setFormCIDDesc] = useState('');
  const [formMedicoNome, setFormMedicoNome] = useState('');
  const [formMedicoCRM, setFormMedicoCRM] = useState('');
  const [formAtestadoNum, setFormAtestadoNum] = useState('');
  const [formObservacoes, setFormObservacoes] = useState('');

  // Prorrogação state
  const [prorrogaDias, setProrrogaDias] = useState(15);
  const [prorrogaMotivo, setProrrogaMotivo] = useState('');
  const [prorrogaBeneficio, setProrrogaBeneficio] = useState('');
  const [prorrogaPericia, setProrrogaPericia] = useState('');

  const { colaboradores } = useColaboradores();
  const { 
    useAfastamentosQuery, 
    useConfigAfastamentos,
    useAfastamentosAtivos,
    calcularDias,
    criarAfastamento,
    encerrarAfastamento,
    prorrogarAfastamento,
    cancelarAfastamento,
    isCriando,
    isProrrogando
  } = useAfastamentos();

  const colaboradoresAtivos = colaboradores?.filter(c => c.status === 'ativo') ?? [];
  
  const { data: config } = useConfigAfastamentos();
  const { data: afastamentos, isLoading } = useAfastamentosQuery({ 
    ano: anoFiltro,
    status: filtroStatus !== 'todos' ? filtroStatus : undefined,
    tipo: filtroTipo !== 'todos' ? filtroTipo : undefined
  });
  const { data: afastamentosAtivos } = useAfastamentosAtivos();

  // Alertas de INSS (> 15 dias)
  const alertasINSS = useMemo(() => {
    return afastamentosAtivos?.filter(a => {
      const dias = differenceInDays(parseISO(a.data_fim_prevista), parseISO(a.data_inicio)) + 1;
      return dias > 15 && ['doenca', 'acidente_trabalho', 'acidente_trajeto'].includes(a.tipo);
    }) ?? [];
  }, [afastamentosAtivos]);

  // Estatísticas
  const stats = useMemo(() => {
    const ativos = afastamentosAtivos?.length ?? 0;
    const esteMes = afastamentos?.filter(a => {
      const data = parseISO(a.data_inicio);
      return data.getMonth() === new Date().getMonth() && data.getFullYear() === new Date().getFullYear();
    }).length ?? 0;
    const maternidade = afastamentosAtivos?.filter(a => a.tipo === 'licenca_maternidade').length ?? 0;
    const inss = afastamentosAtivos?.filter(a => (a.dias_inss ?? 0) > 0).length ?? 0;
    
    return { ativos, esteMes, maternidade, inss };
  }, [afastamentos, afastamentosAtivos]);

  // Calcular dias ao mudar datas
  const diasCalculados = useMemo(() => {
    if (!formDataInicio || !formDataFim) return null;
    return calcularDias(formDataInicio, formDataFim, formTipo, config);
  }, [formDataInicio, formDataFim, formTipo, config]);

  const handleCriar = () => {
    if (!formColaboradorId || !formDataInicio || !formDataFim) return;

    const dias = calcularDias(formDataInicio, formDataFim, formTipo, config);

    criarAfastamento({
      colaborador_id: formColaboradorId,
      tipo: formTipo,
      data_inicio: formDataInicio,
      data_fim_prevista: formDataFim,
      data_fim_real: null,
      dias_empresa: dias.diasEmpresa,
      dias_inss: dias.diasINSS,
      cid: formCID || null,
      cid_descricao: formCIDDesc || null,
      numero_beneficio: null,
      data_pericia: null,
      medico_nome: formMedicoNome || null,
      medico_crm: formMedicoCRM || null,
      atestado_numero: formAtestadoNum || null,
      observacoes: formObservacoes || null,
      status: 'ativo',
      created_by: null
    });

    setDialogOpen(false);
    resetForm();
  };

  const handleProrrogar = () => {
    if (!selectedAfastamentoId || prorrogaDias <= 0) return;

    prorrogarAfastamento({
      afastamentoId: selectedAfastamentoId,
      diasAdicionais: prorrogaDias,
      motivo: prorrogaMotivo || undefined,
      numeroBeneficio: prorrogaBeneficio || undefined,
      dataPericia: prorrogaPericia || undefined
    });

    setProrrogaDialogOpen(false);
    setSelectedAfastamentoId(null);
    setProrrogaDias(15);
    setProrrogaMotivo('');
    setProrrogaBeneficio('');
    setProrrogaPericia('');
  };

  const resetForm = () => {
    setFormColaboradorId('');
    setFormTipo('doenca');
    setFormDataInicio('');
    setFormDataFim('');
    setFormCID('');
    setFormCIDDesc('');
    setFormMedicoNome('');
    setFormMedicoCRM('');
    setFormAtestadoNum('');
    setFormObservacoes('');
  };

  const abrirProrrogacao = (id: string) => {
    setSelectedAfastamentoId(id);
    setProrrogaDialogOpen(true);
  };

  return (
    <>
      <SEOHead title="Afastamentos | DP System" description="Gestão de afastamentos" />
      <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Afastamentos</h1>
          <p className="text-muted-foreground text-sm">Licenças, atestados e afastamentos INSS</p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Novo Afastamento
        </Button>
      </div>

      {/* Alert INSS */}
      {alertasINSS.length > 0 && (
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">
                Atenção: {alertasINSS.length} afastamento(s) {'>'} 15 dias
              </h3>
              <div className="mt-2 space-y-1">
                {alertasINSS.slice(0, 3).map(a => (
                  <p key={a.id} className="text-sm text-muted-foreground">
                    {a.colaborador_nome} - {tipoAfastamentoLabels[a.tipo as TipoAfastamento]} - {a.dias_total} dias
                  </p>
                ))}
              </div>
              <Button size="sm" className="mt-3 gap-2" variant="outline">
                <FileText className="w-4 h-4" />
                Gerar Encaminhamento INSS
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as StatusAfastamento | 'todos')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="prorrogado">Prorrogados</SelectItem>
            <SelectItem value="encerrado">Encerrados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as TipoAfastamento | 'todos')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {Object.entries(tipoAfastamentoLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {tipoAfastamentoIcons[key as TipoAfastamento]} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(anoFiltro)} onValueChange={v => setAnoFiltro(Number(v))}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026].map(ano => (
              <SelectItem key={ano} value={String(ano)}>{ano}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Afastados Atualmente</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.ativos}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Este Mês</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.esteMes}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Lic. Maternidade</p>
          <p className="text-2xl font-bold text-info mt-1">{stats.maternidade}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground uppercase">Encaminhados INSS</p>
          <p className="text-2xl font-bold text-warning mt-1">{stats.inss}</p>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm text-foreground">Registros de Afastamento - {anoFiltro}</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        ) : !afastamentos?.length ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum afastamento encontrado
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Colaborador</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Tipo</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Início</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Prev. Fim</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Dias Emp.</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Dias INSS</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {afastamentos.map((item) => {
                const statusColors = statusAfastamentoColors[item.status];
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                          <span>{tipoAfastamentoIcons[item.tipo as TipoAfastamento]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.colaborador_nome}</p>
                          <p className="text-xs text-muted-foreground">{item.colaborador_departamento}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {tipoAfastamentoLabels[item.tipo as TipoAfastamento]}
                      {item.cid && <span className="text-xs text-muted-foreground ml-1">({item.cid})</span>}
                    </td>
                    <td className="p-4 text-sm text-center text-foreground">
                      {format(parseISO(item.data_inicio), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4 text-sm text-center text-muted-foreground">
                      {format(parseISO(item.data_fim_prevista), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4 text-sm text-center font-semibold text-foreground">
                      {item.dias_empresa}
                    </td>
                    <td className="p-4 text-sm text-center font-semibold text-warning">
                      {item.dias_inss > 0 ? item.dias_inss : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={cn("border-0", statusColors.bg, statusColors.text)}>
                        {statusAfastamentoLabels[item.status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1">
                        {['ativo', 'prorrogado'].includes(item.status) && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-info"
                              onClick={() => abrirProrrogacao(item.id)}
                              title="Prorrogar"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-success"
                              onClick={() => encerrarAfastamento({ id: item.id, dataFimReal: format(new Date(), 'yyyy-MM-dd') })}
                              title="Encerrar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => cancelarAfastamento(item.id)}
                              title="Cancelar"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog Novo Afastamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Afastamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Colaborador</Label>
              <Select value={formColaboradorId} onValueChange={setFormColaboradorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradoresAtivos.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label>Tipo de Afastamento</Label>
              <Select value={formTipo} onValueChange={(v) => setFormTipo(v as TipoAfastamento)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoAfastamentoLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {tipoAfastamentoIcons[key as TipoAfastamento]} {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Data Início</Label>
              <Input type="date" value={formDataInicio} onChange={e => setFormDataInicio(e.target.value)} />
            </div>
            <div>
              <Label>Data Fim Prevista</Label>
              <Input type="date" value={formDataFim} onChange={e => setFormDataFim(e.target.value)} />
            </div>
            
            {diasCalculados && (
              <div className="col-span-2 p-3 rounded-lg bg-muted/30">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold ml-1">{diasCalculados.diasTotal} dias</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Empresa:</span>
                    <span className="font-semibold ml-1 text-foreground">{diasCalculados.diasEmpresa} dias</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">INSS:</span>
                    <span className="font-semibold ml-1 text-warning">{diasCalculados.diasINSS} dias</span>
                  </div>
                </div>
              </div>
            )}
            
            {['doenca', 'acidente_trabalho', 'acidente_trajeto'].includes(formTipo) && (
              <>
                <div>
                  <Label>CID</Label>
                  <Input value={formCID} onChange={e => setFormCID(e.target.value)} placeholder="Ex: J11" />
                </div>
                <div>
                  <Label>Descrição CID</Label>
                  <Input value={formCIDDesc} onChange={e => setFormCIDDesc(e.target.value)} placeholder="Ex: Gripe" />
                </div>
                <div>
                  <Label>Médico</Label>
                  <Input value={formMedicoNome} onChange={e => setFormMedicoNome(e.target.value)} placeholder="Nome do médico" />
                </div>
                <div>
                  <Label>CRM</Label>
                  <Input value={formMedicoCRM} onChange={e => setFormMedicoCRM(e.target.value)} placeholder="CRM" />
                </div>
                <div className="col-span-2">
                  <Label>Nº Atestado</Label>
                  <Input value={formAtestadoNum} onChange={e => setFormAtestadoNum(e.target.value)} placeholder="Número do atestado" />
                </div>
              </>
            )}
            
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea 
                value={formObservacoes} 
                onChange={e => setFormObservacoes(e.target.value)}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button aria-label="Ação" onClick={handleCriar} disabled={isCriando}>
              {isCriando ? 'Salvando...' : 'Registrar Afastamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Prorrogação */}
      <Dialog open={prorrogaDialogOpen} onOpenChange={setProrrogaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prorrogar Afastamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Dias Adicionais</Label>
              <Input 
                type="number" 
                value={prorrogaDias} 
                onChange={e => setProrrogaDias(Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <Label>Nº Benefício INSS</Label>
              <Input 
                value={prorrogaBeneficio} 
                onChange={e => setProrrogaBeneficio(e.target.value)}
                placeholder="Número do benefício"
              />
            </div>
            <div>
              <Label>Data Perícia</Label>
              <Input 
                type="date" 
                value={prorrogaPericia} 
                onChange={e => setProrrogaPericia(e.target.value)}
              />
            </div>
            <div>
              <Label>Motivo</Label>
              <Textarea 
                value={prorrogaMotivo} 
                onChange={e => setProrrogaMotivo(e.target.value)}
                placeholder="Motivo da prorrogação..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setProrrogaDialogOpen(false)}>Cancelar</Button>
            <Button aria-label="Ação" onClick={handleProrrogar} disabled={isProrrogando}>
              {isProrrogando ? 'Salvando...' : 'Prorrogar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
});
