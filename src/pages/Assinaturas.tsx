import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { 
  PenTool, FileSignature, Clock, CheckCircle2, XCircle, Plus,
  Search, MoreHorizontal, Eye, Download, Trash2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAssinaturaDigital, TIPOS_DOCUMENTO } from '@/hooks/useAssinaturaDigital';
import { useColaboradores } from '@/hooks/useColaboradores';
import { AssinaturaDigitalModal } from '@/components/assinatura/AssinaturaDigitalModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentoAssinatura {
  id: string;
  titulo: string;
  tipo: string;
  colaborador_nome?: string;
  colaborador_id?: string;
  data_criacao: string;
  data_assinatura?: string;
  status: 'pendente' | 'assinado' | 'rejeitado' | 'expirado';
  url_documento?: string;
  assinatura_url?: string;
}

const Assinaturas = memo(function Assinaturas() {
  useEffect(() => {
    document.title = 'Assinaturas Digitais | DP System';
  }, []);

  const [search, setSearch] = useState('');
  const [novoDocumentoOpen, setNovoDocumentoOpen] = useState(false);
  const [assinarModalOpen, setAssinarModalOpen] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoAssinatura | null>(null);
  const [visualizarAssinaturaOpen, setVisualizarAssinaturaOpen] = useState(false);
  const [assinaturaVisualizada, setAssinaturaVisualizada] = useState<string | null>(null);

  // Form state
  const [colaboradorId, setColaboradorId] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [titulo, setTitulo] = useState('');

  const { 
    documentosPendentes, 
    documentosAssinados, 
    loadingPendentes,
    loadingAssinados,
    criarDocumento,
    assinarDocumento,
    cancelarDocumento,
    isCriando
  } = useAssinaturaDigital();

  const { colaboradores } = useColaboradores();

  const handleCriarDocumento = () => {
    if (!colaboradorId || !tipoDocumento || !titulo) return;
    
    criarDocumento({
      colaborador_id: colaboradorId,
      tipo_documento: tipoDocumento,
      titulo,
    });
    
    setNovoDocumentoOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setColaboradorId('');
    setTipoDocumento('');
    setTitulo('');
  };

  const handleAssinar = (doc: DocumentoAssinatura) => {
    setDocumentoSelecionado(doc);
    setAssinarModalOpen(true);
  };

  const handleAssinaturaSalva = (assinaturaBase64: string) => {
    if (documentoSelecionado) {
      assinarDocumento({
        documentoId: documentoSelecionado.id,
        assinaturaBase64,
      });
    }
    setAssinarModalOpen(false);
    setDocumentoSelecionado(null);
  };

  const handleVisualizarAssinatura = (base64: string) => {
    setAssinaturaVisualizada(base64);
    setVisualizarAssinaturaOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-warning border-warning"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'assinado':
        return <Badge variant="outline" className="text-success border-success"><CheckCircle2 className="w-3 h-3 mr-1" />Assinado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="text-destructive border-destructive"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filtrarDocumentos = (docs: DocumentoAssinatura[]) => {
    return docs.filter(d => 
      d.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      d.colaboradores?.nome_completo?.toLowerCase().includes(search.toLowerCase()) ||
      d.tipo_documento?.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
      <>
        <SEOHead title="Assinaturas Digitais" description="Gestão de assinaturas digitais" />
        <div id="main-content" className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Assinaturas Digitais</h1>
          <p className="text-muted-foreground text-sm">Gerencie documentos e assinaturas eletrônicas</p>
        </div>
        <Button onClick={() => setNovoDocumentoOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documentosPendentes?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documentosAssinados?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Assinados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileSignature className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(documentosPendentes?.length ?? 0) + (documentosAssinados?.length ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes" className="gap-2">
            <Clock className="w-4 h-4" />
            Pendentes ({documentosPendentes?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="assinados" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Assinados ({documentosAssinados?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos Aguardando Assinatura</CardTitle>
              <CardDescription>Clique em "Assinar" para assinar digitalmente</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loadingPendentes ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : filtrarDocumentos(documentosPendentes).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileSignature className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Nenhum documento pendente
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtrarDocumentos(documentosPendentes).map((doc: DocumentoAssinatura) => (
                      <div 
                        key={doc.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                          <PenTool className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.colaboradores?.nome_completo} • {TIPOS_DOCUMENTO.find(t => t.value === doc.tipo_documento)?.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Criado em {format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        {getStatusBadge(doc.status)}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAssinar(doc)}>
                            <PenTool className="w-4 h-4 mr-1" />
                            Assinar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => cancelarDocumento(doc.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assinados" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos Assinados</CardTitle>
              <CardDescription>Histórico de documentos com assinatura digital</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loadingAssinados ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
                  </div>
                ) : filtrarDocumentos(documentosAssinados).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Nenhum documento assinado
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtrarDocumentos(documentosAssinados).map((doc: DocumentoAssinatura) => (
                      <div 
                        key={doc.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.colaboradores?.nome_completo} • {TIPOS_DOCUMENTO.find(t => t.value === doc.tipo_documento)?.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assinado em {doc.assinado_em && format(new Date(doc.assinado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        {getStatusBadge(doc.status)}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVisualizarAssinatura(doc.assinatura_base64)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Assinatura
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Novo Documento */}
      <Dialog open={novoDocumentoOpen} onOpenChange={setNovoDocumentoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Documento para Assinatura</DialogTitle>
            <DialogDescription>
              Crie um documento que será enviado para assinatura digital
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Colaborador</Label>
              <Select value={colaboradorId} onValueChange={setColaboradorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {colaboradores.filter(c => c.status === 'ativo').map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map(tipo => (
                    <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Título do Documento</Label>
              <Input 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Contrato de Trabalho - João Silva"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovoDocumentoOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCriarDocumento}
              disabled={!colaboradorId || !tipoDocumento || !titulo || isCriando}
            >
              {isCriando ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Assinatura */}
      {documentoSelecionado && (
        <AssinaturaDigitalModal
          open={assinarModalOpen}
          onOpenChange={setAssinarModalOpen}
          documento={documentoSelecionado.titulo}
          onAssinaturaSalva={handleAssinaturaSalva}
        />
      )}

      {/* Modal Visualizar Assinatura */}
      <Dialog open={visualizarAssinaturaOpen} onOpenChange={setVisualizarAssinaturaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assinatura Digital</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {assinaturaVisualizada && (
              <img 
                src={assinaturaVisualizada} 
                alt="Assinatura" 
                className="max-w-full border rounded-lg"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVisualizarAssinaturaOpen(false)}>
              Fechar
            </Button>
            {assinaturaVisualizada && (
              <Button onClick={() => {
                const link = document.createElement('a');
                link.download = 'assinatura.png';
                link.href = assinaturaVisualizada;
                link.click();
              }}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  
      </>);
}
