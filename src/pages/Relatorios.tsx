import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { 
  FileText, Download, Calendar, Users, Wallet, Clock, Umbrella, Heart, 
  UserMinus, BarChart3, Plus, Loader2, FileSpreadsheet, File, ChevronDown,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRelatorios, FormatoRelatorio } from '@/hooks/useRelatorios';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useAgendamentoRelatorios } from '@/hooks/useAgendamentoRelatorios';
import { AgendamentoRelatoriosModal } from '@/components/relatorios/AgendamentoRelatoriosModal';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RelatorioConfig {
  nome: string;
  formatos: FormatoRelatorio[];
  action: string;
  requiresParams?: boolean;
  paramType?: 'colaborador' | 'competencia' | 'ano' | 'mes' | 'periodo';
}

interface CategoriaConfig {
  titulo: string;
  icone: React.ComponentType;
  color: string;
  relatorios: RelatorioConfig[];
}

const categorias: CategoriaConfig[] = [
  {
    titulo: 'Cadastro',
    icone: Users,
    color: 'text-info',
    relatorios: [
      { nome: 'Ficha Registro', formatos: ['PDF', 'Excel'], action: 'fichaRegistro', requiresParams: true, paramType: 'colaborador' },
      { nome: 'Lista de Colaboradores', formatos: ['PDF', 'Excel', 'CSV'], action: 'listaColaboradores' },
      { nome: 'Aniversariantes', formatos: ['PDF', 'Excel'], action: 'aniversariantes', requiresParams: true, paramType: 'mes' },
      { nome: 'Por Departamento', formatos: ['PDF', 'Excel'], action: 'porDepartamento' },
    ]
  },
  {
    titulo: 'Folha',
    icone: Wallet,
    color: 'text-sales',
    relatorios: [
      { nome: 'Resumo Folha', formatos: ['PDF', 'Excel'], action: 'resumoFolha', requiresParams: true, paramType: 'competencia' },
      { nome: 'Encargos', formatos: ['PDF', 'Excel'], action: 'encargos', requiresParams: true, paramType: 'competencia' },
    ]
  },
  {
    titulo: 'Ponto',
    icone: Clock,
    color: 'text-info',
    relatorios: [
      { nome: 'Espelho de Ponto', formatos: ['PDF', 'Excel'], action: 'espelhoPonto', requiresParams: true, paramType: 'colaborador' },
      { nome: 'Banco de Horas', formatos: ['PDF', 'Excel'], action: 'bancoHoras' },
    ]
  },
  {
    titulo: 'Férias',
    icone: Umbrella,
    color: 'text-warning',
    relatorios: [
      { nome: 'Programação', formatos: ['PDF', 'Excel'], action: 'programacaoFerias', requiresParams: true, paramType: 'ano' },
      { nome: 'Vencimentos', formatos: ['PDF', 'Excel'], action: 'feriasVencer' },
    ]
  },
  {
    titulo: 'Afastamentos',
    icone: Heart,
    color: 'text-loggi',
    relatorios: [
      { nome: 'Por Tipo', formatos: ['PDF', 'Excel'], action: 'afastamentosTipo', requiresParams: true, paramType: 'periodo' },
      { nome: 'Absenteísmo', formatos: ['PDF', 'Excel'], action: 'absenteismo', requiresParams: true, paramType: 'competencia' },
    ]
  },
  {
    titulo: 'Desligamentos',
    icone: UserMinus,
    color: 'text-destructive',
    relatorios: [
      { nome: 'Por Motivo', formatos: ['PDF', 'Excel'], action: 'desligamentosMotivo', requiresParams: true, paramType: 'periodo' },
      { nome: 'Turnover', formatos: ['PDF', 'Excel'], action: 'turnover', requiresParams: true, paramType: 'ano' },
    ]
  },
];

export default memo(function Relatorios() {
  useEffect(() => { document.title = 'Relatórios | DP System'; }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [agendamentoModalOpen, setAgendamentoModalOpen] = useState(false);
  const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioConfig | null>(null);
  const [formato, setFormato] = useState<FormatoRelatorio>('PDF');
  const [colaboradorId, setColaboradorId] = useState('');
  const [competencia, setCompetencia] = useState(format(new Date(), 'yyyy-MM'));
  const [ano, setAno] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const relatorios = useRelatorios();
  const { colaboradores } = useColaboradores();
  const { agendamentos } = useAgendamentoRelatorios();

  const handleOpenModal = (rel: RelatorioConfig) => {
    setSelectedRelatorio(rel);
    setFormato(rel.formatos[0]);
    setModalOpen(true);
  };

  const handleGerarDireto = async (rel: RelatorioConfig, fmt: FormatoRelatorio) => {
    if (rel.requiresParams) {
      setSelectedRelatorio(rel);
      setFormato(fmt);
      setModalOpen(true);
      return;
    }

    await executarRelatorio(rel.action, fmt);
  };

  const executarRelatorio = async (action: string, fmt: FormatoRelatorio) => {
    const colab = colaboradores.find(c => c.id === colaboradorId);
    
    switch (action) {
      case 'listaColaboradores':
        await relatorios.gerarListaColaboradores(fmt);
        break;
      case 'aniversariantes':
        await relatorios.gerarAniversariantes(fmt, parseInt(mes));
        break;
      case 'porDepartamento':
        await relatorios.gerarPorDepartamento(fmt);
        break;
      case 'fichaRegistro':
        if (colaboradorId) await relatorios.gerarFichaRegistro(colaboradorId, fmt);
        break;
      case 'resumoFolha':
        await relatorios.gerarResumoFolha(competencia, fmt);
        break;
      case 'encargos':
        await relatorios.gerarEncargos(competencia, fmt);
        break;
      case 'programacaoFerias':
        await relatorios.gerarProgramacaoFerias(parseInt(ano), fmt);
        break;
      case 'feriasVencer':
        await relatorios.gerarFeriasVencer(fmt);
        break;
      case 'afastamentosTipo':
        await relatorios.gerarAfastamentosPorTipo(fmt, { dataInicio, dataFim });
        break;
      case 'absenteismo':
        await relatorios.gerarAbsenteismo(fmt, competencia);
        break;
      case 'turnover':
        await relatorios.gerarTurnover(fmt, parseInt(ano));
        break;
      case 'desligamentosMotivo':
        await relatorios.gerarDesligamentosPorMotivo(fmt, { dataInicio, dataFim });
        break;
      case 'espelhoPonto':
        if (colaboradorId && colab) {
          await relatorios.gerarEspelhoPonto(colaboradorId, colab.nome_completo, competencia, fmt);
        }
        break;
      case 'bancoHoras':
        await relatorios.gerarBancoHoras(fmt);
        break;
      case 'indicadoresDP':
        await relatorios.gerarIndicadoresDP(fmt);
        break;
    }
    
    setModalOpen(false);
  };

  const handleGerar = async () => {
    if (!selectedRelatorio) return;
    await executarRelatorio(selectedRelatorio.action, formato);
  };

  const renderParamFields = () => {
    if (!selectedRelatorio?.paramType) return null;

    switch (selectedRelatorio.paramType) {
      case 'colaborador':
        return (
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={colaboradorId} onValueChange={setColaboradorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o colaborador" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {colaboradores.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRelatorio.action === 'espelhoPonto' && (
              <div className="mt-4 space-y-2">
                <Label>Competência</Label>
                <Input 
                  type="month" 
                  value={competencia} 
                  onChange={(e) => setCompetencia(e.target.value)} 
                />
              </div>
            )}
          </div>
        );
      case 'competencia':
        return (
          <div className="space-y-2">
            <Label>Competência</Label>
            <Input 
              type="month" 
              value={competencia} 
              onChange={(e) => setCompetencia(e.target.value)} 
            />
          </div>
        );
      case 'ano':
        return (
          <div className="space-y-2">
            <Label>Ano</Label>
            <Select value={ano} onValueChange={setAno}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'mes':
        return (
          <div className="space-y-2">
            <Label>Mês</Label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'periodo':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input 
                type="date" 
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input 
                type="date" 
                value={dataFim} 
                onChange={(e) => setDataFim(e.target.value)} 
              />
            </div>
          </div>
        );
    }
  };

  const getFormatoIcon = (fmt: FormatoRelatorio) => {
    switch (fmt) {
      case 'PDF': return <File className="w-3 h-3" />;
      case 'Excel': return <FileSpreadsheet className="w-3 h-3" />;
      case 'CSV': return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground text-sm">Central de relatórios do Departamento Pessoal</p>
        </div>
        <Button aria-label="Ação" onClick={() => {
          setSelectedRelatorio({ nome: 'Indicadores DP', formatos: ['PDF', 'Excel'], action: 'indicadoresDP' });
          setFormato('PDF');
          executarRelatorio('indicadoresDP', 'PDF');
        }} disabled={relatorios.gerando}>
          {relatorios.gerando ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <BarChart3 className="w-4 h-4 mr-2" />
          )}
          Indicadores DP
        </Button>
      </div>

      {/* Grid de Categorias */}
      <div className="grid md:grid-cols-3 gap-4">
        {categorias.map((cat) => (
          <div key={cat.titulo} className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <cat.icone className={`w-5 h-5 ${cat.color}`} />
              <h3 className="font-semibold text-sm text-foreground">{cat.titulo}</h3>
            </div>
            <ul className="space-y-2">
              {cat.relatorios.map((rel) => (
                <li key={rel.nome} className="flex items-center justify-between group">
                  <span 
                    className="text-sm text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer flex-1"
                    onClick={() => handleOpenModal(rel)}
                  >
                    • {rel.nome}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-label="Ação" variant="ghost" size="sm" className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-3 h-3 mr-1" />
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {rel.formatos.map(fmt => (
                        <DropdownMenuItem 
                          key={fmt} 
                          onClick={() => handleGerarDireto(rel, fmt)}
                          disabled={relatorios.gerando}
                        >
                          {getFormatoIcon(fmt)}
                          <span className="ml-2">{fmt}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Indicadores</h3>
          </div>
          <ul className="space-y-2">
            {[
              { nome: 'Headcount', action: 'listaColaboradores' },
              { nome: 'Turnover', action: 'turnover' },
              { nome: 'Absenteísmo', action: 'absenteismo' },
              { nome: 'Custo por FTE', action: 'indicadoresDP' },
            ].map((ind) => (
              <li 
                key={ind.nome}
                className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  if (ind.action === 'turnover') {
                    handleOpenModal({ nome: 'Turnover', formatos: ['PDF', 'Excel'], action: 'turnover', requiresParams: true, paramType: 'ano' });
                  } else if (ind.action === 'absenteismo') {
                    handleOpenModal({ nome: 'Absenteísmo', formatos: ['PDF', 'Excel'], action: 'absenteismo', requiresParams: true, paramType: 'competencia' });
                  } else {
                    executarRelatorio(ind.action, 'PDF');
                  }
                }}
              >
                <span className="text-sm text-muted-foreground">• {ind.nome}</span>
                <Badge variant="outline" className="text-xs">PDF</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-sm text-foreground">Obrigações</h3>
          </div>
          <ul className="space-y-2">
            {[
              { nome: 'eSocial', desc: 'Eventos e pendências' },
              { nome: 'FGTS', desc: 'Guia mensal' },
              { nome: 'INSS/IRRF', desc: 'Encargos' },
              { nome: 'DIRF', desc: 'Declaração anual' },
            ].map((obr) => (
              <li 
                key={obr.nome}
                className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  handleOpenModal({ 
                    nome: obr.nome, 
                    formatos: ['PDF', 'Excel'], 
                    action: 'encargos', 
                    requiresParams: true, 
                    paramType: 'competencia' 
                  });
                }}
              >
                <span className="text-sm text-muted-foreground">• {obr.nome}</span>
                <Badge variant="outline" className="text-xs">PDF</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Relatórios Agendados */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Relatórios Agendados</h3>
            {agendamentos && agendamentos.length > 0 && (
              <Badge variant="secondary" className="text-xs">{agendamentos.length}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setAgendamentoModalOpen(true)}>
              <Settings className="w-3 h-3" />
              Gerenciar
            </Button>
            <Button size="sm" variant="default" className="gap-1" onClick={() => setAgendamentoModalOpen(true)}>
              <Plus className="w-3 h-3" />
              Agendar
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {agendamentos && agendamentos.length > 0 ? (
            agendamentos.slice(0, 3).map((ag) => (
              <div key={ag.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{ag.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {ag.frequencia === 'diario' ? 'Diário' : ag.frequencia === 'semanal' ? 'Semanal' : 'Mensal'} às {ag.hora_envio?.slice(0, 5)} - {ag.email_destinatario}
                  </p>
                </div>
                <Badge variant={ag.ativo ? "default" : "secondary"}>{ag.ativo ? "Ativo" : "Pausado"}</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum relatório agendado</p>
              <Button size="sm" variant="link" onClick={() => setAgendamentoModalOpen(true)}>
                Criar primeiro agendamento
              </Button>
            </div>
          )}
          {agendamentos && agendamentos.length > 3 && (
            <Button aria-label="Ação" variant="ghost" size="sm" className="w-full" onClick={() => setAgendamentoModalOpen(true)}>
              Ver todos ({agendamentos.length})
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Agendamento */}
      <AgendamentoRelatoriosModal open={agendamentoModalOpen} onOpenChange={setAgendamentoModalOpen} />

      {/* Modal de Parâmetros */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Relatório: {selectedRelatorio?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderParamFields()}
            
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select value={formato} onValueChange={(v) => setFormato(v as FormatoRelatorio)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedRelatorio?.formatos.map(fmt => (
                    <SelectItem key={fmt} value={fmt}>
                      <div className="flex items-center gap-2">
                        {getFormatoIcon(fmt)}
                        {fmt}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button aria-label="Ação" variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button aria-label="Ação" onClick={handleGerar} disabled={relatorios.gerando}>
              {relatorios.gerando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Gerar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
