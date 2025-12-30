import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { History, Search, Filter, RefreshCw, ChevronDown, ChevronRight, Eye, Calendar, User, Database, Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuditoria, AuditLog } from '@/hooks/useAuditoria';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Auditoria = memo(function Auditoria() {
  useEffect(() => {
    document.title = 'Auditoria | DP System';
  }, []);

  const [filtroTabela, setFiltroTabela] = useState('todas');
  const [filtroAcao, setFiltroAcao] = useState('todas');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [busca, setBusca] = useState('');
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [logSelecionado, setLogSelecionado] = useState<AuditLog | null>(null);

  const { logs, isLoading, refetch, estatisticas, TABELA_LABELS, ACAO_LABELS, ACAO_COLORS } = useAuditoria({
    tabela: filtroTabela,
    acao: filtroAcao,
    dataInicio: filtroDataInicio,
    dataFim: filtroDataFim,
  });

  const logsFiltrados = logs.filter(log => {
    if (!busca) return true;
    const termo = busca.toLowerCase();
    return (
      log.user_email?.toLowerCase().includes(termo) ||
      log.tabela.toLowerCase().includes(termo) ||
      JSON.stringify(log.dados_novos || {}).toLowerCase().includes(termo) ||
      JSON.stringify(log.dados_anteriores || {}).toLowerCase().includes(termo)
    );
  });

  const getAcaoIcon = (acao: string) => {
    switch (acao) {
      case 'INSERT': return <Plus className="w-3.5 h-3.5" />;
      case 'UPDATE': return <Pencil className="w-3.5 h-3.5" />;
      case 'DELETE': return <Trash2 className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const formatarData = (data: string) => {
    return format(parseISO(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const verDetalhes = (log: AuditLog) => {
    setLogSelecionado(log);
    setDetalhesOpen(true);
  };

  const limparFiltros = () => {
    setFiltroTabela('todas');
    setFiltroAcao('todas');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setBusca('');
  };

  const hasFilters = filtroTabela !== 'todas' || filtroAcao !== 'todas' || filtroDataInicio || filtroDataFim || busca;

  return (
    <>
      <SEOHead title="Auditoria | DP System" description="Trilha de auditoria do sistema" />
    <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Trilha de Auditoria
          </h1>
          <p className="text-muted-foreground text-sm">Histórico completo de alterações no sistema</p>
        </div>
        <Button aria-label="Ação" variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estatisticas.total}</p>
                <p className="text-xs text-muted-foreground">Total de registros</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Plus className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estatisticas.porAcao.INSERT}</p>
                <p className="text-xs text-muted-foreground">Criações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Pencil className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estatisticas.porAcao.UPDATE}</p>
                <p className="text-xs text-muted-foreground">Alterações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{estatisticas.porAcao.DELETE}</p>
                <p className="text-xs text-muted-foreground">Exclusões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar em logs..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filtroTabela} onValueChange={setFiltroTabela}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tabela" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as tabelas</SelectItem>
            {Object.entries(TABELA_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroAcao} onValueChange={setFiltroAcao}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas ações</SelectItem>
            {Object.entries(ACAO_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            className="w-[140px]"
            placeholder="Data início"
          />
          <span className="text-muted-foreground">a</span>
          <Input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            className="w-[140px]"
            placeholder="Data fim"
          />
        </div>

        {hasFilters && (
          <Button aria-label="Ação" variant="ghost" size="sm" onClick={limparFiltros} className="gap-1">
            <X className="w-3 h-3" />
            Limpar
          </Button>
        )}
      </div>

      {/* Lista de Logs */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            Registros de Auditoria ({logsFiltrados.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : logsFiltrados.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum registro encontrado</div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-border">
              {logsFiltrados.map((log) => (
                <div
                  key={log.id}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => verDetalhes(log)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        ACAO_COLORS[log.acao]?.bg
                      )}>
                        <span className={ACAO_COLORS[log.acao]?.text}>
                          {getAcaoIcon(log.acao)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {TABELA_LABELS[log.tabela] || log.tabela}
                          </Badge>
                          <Badge className={cn("text-xs", ACAO_COLORS[log.acao]?.bg, ACAO_COLORS[log.acao]?.text, "border-0")}>
                            {ACAO_LABELS[log.acao]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.acao === 'UPDATE' && log.campos_alterados ? (
                            <>Campos alterados: <span className="text-foreground">{log.campos_alterados.join(', ')}</span></>
                          ) : log.acao === 'INSERT' ? (
                            'Novo registro criado'
                          ) : (
                            'Registro excluído'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {formatarData(log.created_at)}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                        <User className="w-3 h-3" />
                        {log.user_email || 'Sistema'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesOpen} onOpenChange={setDetalhesOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Detalhes do Registro
            </DialogTitle>
          </DialogHeader>

          {logSelecionado && (
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {/* Info básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Tabela</p>
                    <p className="font-medium">{TABELA_LABELS[logSelecionado.tabela] || logSelecionado.tabela}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Ação</p>
                    <Badge className={cn(ACAO_COLORS[logSelecionado.acao]?.bg, ACAO_COLORS[logSelecionado.acao]?.text, "border-0")}>
                      {ACAO_LABELS[logSelecionado.acao]}
                    </Badge>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Data/Hora</p>
                    <p className="font-medium">{formatarData(logSelecionado.created_at)}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Usuário</p>
                    <p className="font-medium">{logSelecionado.user_email || 'Sistema'}</p>
                  </div>
                </div>

                {/* Campos alterados */}
                {logSelecionado.campos_alterados && logSelecionado.campos_alterados.length > 0 && (
                  <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Campos Alterados</p>
                    <div className="flex flex-wrap gap-1">
                      {logSelecionado.campos_alterados.map((campo) => (
                        <Badge key={campo} variant="outline" className="text-xs">
                          {campo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dados anteriores */}
                {logSelecionado.dados_anteriores && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-destructive">Dados Anteriores</p>
                    <pre className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(logSelecionado.dados_anteriores, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Dados novos */}
                {logSelecionado.dados_novos && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-success">Dados Novos</p>
                    <pre className="p-3 bg-success/5 border border-success/20 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(logSelecionado.dados_novos, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
});

export default Auditoria;

