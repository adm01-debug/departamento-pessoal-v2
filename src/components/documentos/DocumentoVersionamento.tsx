import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GitBranch, Clock, User, Download, Eye, RotateCcw, Plus, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Versao {
  id: string;
  documento_id: string;
  numero_versao: number;
  data_criacao: string;
  criado_por: string;
  criado_por_nome: string;
  tamanho: number;
  url: string;
  descricao_alteracao?: string;
  hash?: string;
  is_atual: boolean;
}

interface DocumentoVersionamentoProps {
  documentoId: string;
  documentoNome: string;
  versoes: Versao[];
  onNovaVersao?: (arquivo: File, descricao: string) => Promise<void>;
  onRestaurar?: (versaoId: string) => Promise<void>;
  onDownload?: (versaoId: string) => Promise<string>;
  onPreview?: (versaoId: string) => void;
  onComparar?: (versaoId1: string, versaoId2: string) => void;
  modoVisualizacao?: boolean;
}

export function DocumentoVersionamento({
  documentoId,
  documentoNome,
  versoes,
  onNovaVersao,
  onRestaurar,
  onDownload,
  onPreview,
  onComparar,
  modoVisualizacao = false
}: DocumentoVersionamentoProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [descricao, setDescricao] = useState("");
  const [expandido, setExpandido] = useState<string[]>([]);
  const [comparando, setComparando] = useState<string[]>([]);

  const formatarData = (data: string) => new Date(data).toLocaleString("pt-BR");
  const formatarTamanho = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleNovaVersao = async () => {
    if (!arquivo) {
      toast({ title: "Erro", description: "Selecione um arquivo", variant: "destructive" });
      return;
    }
    try {
      await onNovaVersao?.(arquivo, descricao);
      toast({ title: "Sucesso", description: "Nova versão enviada" });
      setArquivo(null);
      setDescricao("");
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao enviar versão", variant: "destructive" });
    }
  };

  const handleRestaurar = async (versaoId: string) => {
    if (!confirm("Deseja restaurar esta versão? Ela se tornará a versão atual.")) return;
    try {
      await onRestaurar?.(versaoId);
      toast({ title: "Sucesso", description: "Versão restaurada" });
    } catch {
      toast({ title: "Erro", description: "Falha ao restaurar", variant: "destructive" });
    }
  };

  const handleDownload = async (versaoId: string) => {
    try {
      const url = await onDownload?.(versaoId);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${documentoNome}_v${versoes.find(v => v.id === versaoId)?.numero_versao}`;
        link.click();
      }
    } catch {
      toast({ title: "Erro", description: "Falha ao baixar", variant: "destructive" });
    }
  };

  const toggleExpandir = (id: string) => {
    setExpandido(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const toggleComparar = (id: string) => {
    setComparando(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const executarComparacao = () => {
    if (comparando.length === 2) {
      onComparar?.(comparando[0], comparando[1]);
    }
  };

  const versaoAtual = versoes.find(v => v.is_atual);
  const versoesAnteriores = versoes.filter(v => !v.is_atual).sort((a, b) => b.numero_versao - a.numero_versao);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Histórico de Versões - {documentoNome}
        </CardTitle>
        <div className="flex gap-2">
          {comparando.length === 2 && (
            <Button variant="outline" size="sm" onClick={executarComparacao}>
              Comparar v{versoes.find(v => v.id === comparando[0])?.numero_versao} com v{versoes.find(v => v.id === comparando[1])?.numero_versao}
            </Button>
          )}
          {!modoVisualizacao && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nova Versão</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Enviar Nova Versão</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <input type="file" onChange={e => setArquivo(e.target.files?.[0] || null)} className="w-full" />
                  </div>
                  <div>
                    <Textarea placeholder="Descreva as alterações desta versão..." value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} />
                  </div>
                  <Button onClick={handleNovaVersao} className="w-full">Enviar</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Versão Atual */}
        {versaoAtual && (
          <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Versão {versaoAtual.numero_versao}</span>
                    <Badge>Atual</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />{formatarData(versaoAtual.data_criacao)}
                    <User className="h-3 w-3 ml-2" />{versaoAtual.criado_por_nome}
                    <span className="ml-2">{formatarTamanho(versaoAtual.tamanho)}</span>
                  </div>
                  {versaoAtual.descricao_alteracao && (
                    <p className="text-sm mt-1">{versaoAtual.descricao_alteracao}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onPreview?.(versaoAtual.id)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(versaoAtual.id)}><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        )}

        {/* Versões Anteriores */}
        {versoesAnteriores.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Versões Anteriores</h4>
            {versoesAnteriores.map(versao => {
              const isExpanded = expandido.includes(versao.id);
              const isComparando = comparando.includes(versao.id);

              return (
                <div key={versao.id} className={`border rounded-lg ${isComparando ? "border-blue-500 bg-blue-50" : ""}`}>
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50" onClick={() => toggleExpandir(versao.id)}>
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="font-medium">Versão {versao.numero_versao}</span>
                      <span className="text-sm text-muted-foreground">{formatarData(versao.data_criacao)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={isComparando} onChange={() => toggleComparar(versao.id)} onClick={e => e.stopPropagation()} title="Selecionar para comparação" />
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); onPreview?.(versao.id); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDownload(versao.id); }}><Download className="h-4 w-4" /></Button>
                      {!modoVisualizacao && (
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleRestaurar(versao.id); }} title="Restaurar esta versão"><RotateCcw className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t">
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div><span className="text-muted-foreground">Autor:</span> {versao.criado_por_nome}</div>
                        <div><span className="text-muted-foreground">Tamanho:</span> {formatarTamanho(versao.tamanho)}</div>
                        {versao.hash && <div className="col-span-2"><span className="text-muted-foreground">Hash:</span> <code className="text-xs">{versao.hash}</code></div>}
                        {versao.descricao_alteracao && <div className="col-span-2"><span className="text-muted-foreground">Alterações:</span> {versao.descricao_alteracao}</div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {versoes.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma versão registrada</p>}

        {/* Timeline visual */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Timeline</h4>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {versoes.sort((a, b) => a.numero_versao - b.numero_versao).map((v, i) => (
              <React.Fragment key={v.id}>
                <div className={`flex flex-col items-center ${v.is_atual ? "text-primary" : "text-muted-foreground"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${v.is_atual ? "bg-primary text-white" : "bg-muted"}`}>{v.numero_versao}</div>
                  <span className="text-xs mt-1">{new Date(v.data_criacao).toLocaleDateString("pt-BR")}</span>
                </div>
                {i < versoes.length - 1 && <div className="w-8 h-0.5 bg-muted" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentoVersionamento;
