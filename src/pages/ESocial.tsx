import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { 
  FileText, Upload, Download, AlertTriangle, CheckCircle, 
  Clock, RefreshCw, Loader2, Eye, Filter, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useESocial, TipoEvento, StatusEvento } from '@/hooks/useESocial';
import { useColaboradores } from '@/hooks/useColaboradores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const tipoEventoLabels: Record<TipoEvento, string> = {
  'S-2200': 'Admissão',
  'S-2205': 'Alteração Cadastral',
  'S-2206': 'Alteração Contrato',
  'S-2230': 'Afastamento',
  'S-2299': 'Desligamento',
  'S-2300': 'TSV - Início',
  'S-2399': 'TSV - Término',
  'S-1200': 'Remuneração',
  'S-1210': 'Pagamentos',
};

const statusColors: Record<StatusEvento, string> = {
  pendente: 'bg-muted text-muted-foreground',
  gerado: 'bg-info/20 text-info',
  enviado: 'bg-warning/20 text-warning',
  processado: 'bg-success/20 text-success',
  rejeitado: 'bg-destructive/20 text-destructive',
  erro: 'bg-destructive/20 text-destructive',
};

export default memo(function ESocial() {
  useEffect(() => {
    document.title = 'eSocial | DP System';
  }, []);

  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [xmlContent, setXmlContent] = useState('');
  const [gerarModalOpen, setGerarModalOpen] = useState(false);
  const [tipoGerar, setTipoGerar] = useState<'admissao' | 'desligamento'>('admissao');
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');

  const { 
    eventosPendentes, 
    loadingPendentes, 
    gerarEventoAdmissao, 
    gerarEventoDesligamento,
    downloadXML,
    isGenerating 
  } = useESocial();
  
  const { colaboradores } = useColaboradores();

  const eventosFiltrados = (eventosPendentes ?? []).filter(e => {
    if (filtroStatus !== 'todos' && e.status !== filtroStatus) return false;
    if (filtroTipo !== 'todos' && e.tipo !== filtroTipo) return false;
    return true;
  });

  const handleGerarEvento = async () => {
    if (!colaboradorSelecionado) {
      toast.error('Selecione um colaborador');
      return;
    }
    try {
      if (tipoGerar === 'admissao') {
        await gerarEventoAdmissao(colaboradorSelecionado);
      } else {
        await gerarEventoDesligamento(colaboradorSelecionado);
      }
      setGerarModalOpen(false);
      setColaboradorSelecionado('');
    } catch (error) {
      logger.error('Error', error);
    }
  };

  const handleVisualizarXML = (xml: string) => {
    setXmlContent(xml);
    setXmlModalOpen(true);
  };

  // KPIs
  const kpis = {
    pendentes: eventosPendentes?.filter(e => e.status === 'pendente').length ?? 0,
    gerados: eventosPendentes?.filter(e => e.status === 'gerado').length ?? 0,
    enviados: eventosPendentes?.filter(e => e.status === 'enviado').length ?? 0,
    processados: eventosPendentes?.filter(e => e.status === 'processado').length ?? 0,
    rejeitados: eventosPendentes?.filter(e => e.status === 'rejeitado' || e.status === 'erro').length ?? 0,
  };

  return (
    <>
      <SEOHead title="eSocial | DP System" description="Integração eSocial" />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">eSocial</h1>
          <p className="text-muted-foreground">Gestão de eventos eSocial</p>
        </div>
        <Button aria-label="Ação" onClick={() => setGerarModalOpen(true)}>
          <FileText className="w-4 h-4 mr-2" />
          Gerar Evento
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{kpis.pendentes}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-info" />
              <div>
                <p className="text-2xl font-bold">{kpis.gerados}</p>
                <p className="text-xs text-muted-foreground">Gerados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{kpis.enviados}</p>
                <p className="text-xs text-muted-foreground">Enviados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{kpis.processados}</p>
                <p className="text-xs text-muted-foreground">Processados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{kpis.rejeitados}</p>
                <p className="text-xs text-muted-foreground">Rejeitados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="gerado">Gerado</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="processado">Processado</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Tipos</SelectItem>
            <SelectItem value="S-2200">S-2200 Admissão</SelectItem>
            <SelectItem value="S-2299">S-2299 Desligamento</SelectItem>
            <SelectItem value="S-2230">S-2230 Afastamento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>Lista de eventos eSocial gerados</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPendentes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {eventosFiltrados.map(evento => (
                <div 
                  key={evento.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center">
                      <Badge variant="outline" className="font-mono">
                        {evento.tipo}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">
                        {tipoEventoLabels[evento.tipo as TipoEvento]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(evento as unknown).colaborador?.nome_completo || 'Colaborador'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">
                        {format(new Date(evento.data_evento), 'dd/MM/yyyy')}
                      </p>
                      <Badge className={statusColors[evento.status as StatusEvento]}>
                        {evento.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {evento.xml && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleVisualizarXML(evento.xml!)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => downloadXML(evento)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Gerar Evento */}
      <Dialog open={gerarModalOpen} onOpenChange={setGerarModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Evento eSocial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo de Evento</label>
              <Select value={tipoGerar} onValueChange={(v: unknown) => setTipoGerar(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admissao">S-2200 - Admissão</SelectItem>
                  <SelectItem value="desligamento">S-2299 - Desligamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Colaborador</label>
              <Select value={colaboradorSelecionado} onValueChange={setColaboradorSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button aria-label="Ação" variant="outline" onClick={() => setGerarModalOpen(false)}>
              Cancelar
            </Button>
            <Button aria-label="Ação" onClick={handleGerarEvento} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Gerar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar XML */}
      <Dialog open={xmlModalOpen} onOpenChange={setXmlModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>XML do Evento</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
              {xmlContent}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
