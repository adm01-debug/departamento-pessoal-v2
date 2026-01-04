import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GitBranch, Clock, User, Download, Eye, RotateCcw, GitCompare, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Versao {
  id: string;
  documento_id: string;
  numero_versao: string;
  descricao_alteracao: string;
  autor_id: string;
  autor_nome: string;
  data_criacao: string;
  tamanho: number;
  url: string;
  hash: string;
  is_atual: boolean;
}

interface DocumentoVersionamentoProps {
  documentoId: string;
  documentoNome: string;
  versoes: Versao[];
  onNovaVersao?: (arquivo: File, descricao: string) => Promise<void>;
  onRestaurar?: (versaoId: string) => Promise<void>;
  onDownload?: (versaoId: string) => Promise<string>;
  onComparar?: (versaoA: string, versaoB: string) => Promise<string>;
  onPreview?: (versaoId: string) => void;
  modoVisualizacao?: boolean;
}

export function DocumentoVersionamento({
  documentoId,
  documentoNome,
  versoes,
  onNovaVersao,
  onRestaurar,
  onDownload,
  onComparar,
  onPreview,
  modoVisualizacao = false
}: DocumentoVersionamentoProps) {
  const { toast } = useToast();
  const [descricaoNovaVersao, setDescricaoNovaVersao] = useState("");
  const [arquivoNovaVersao, setArquivoNovaVersao] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [compararDialogOpen, setCompararDialogOpen] = useState(false);
  const [versaoA, setVersaoA] = useState<string>("");
  const [versaoB, setVersaoB] = useState<string>("");

  const formatarTamanho = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleNovaVersao = async () => {
    if (!arquivoNovaVersao) {
      toast({ title: "Erro", description: "Selecione um arquivo", variant: "destructive" });
      return;
    }
    try {
      await onNovaVersao?.(arquivoNovaVersao, descricaoNovaVersao);
      toast({ title: "Sucesso", description: "Nova versão criada" });
      setDescricaoNovaVersao("");
      setArquivoNovaVersao(null);
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao criar versão", variant: "destructive" });
    }
  };

  const handleRestaurar = async (versaoId: string, numero: string) => {
    if (!confirm(`Deseja restaurar a versão ${numero}? A versão atual será arquivada.`)) return;
    try {
      await onRestaurar?.(versaoId);
      toast({ title: "Sucesso", description: `Versão ${numero} restaurada` });
    } catch {
      toast({ title: "Erro", description: "Falha ao restaurar", variant: "destructive" });
    }
  };

  const handleDownload = async (versaoId: string, nome: string) => {
    try {
      const url = await onDownload?.(versaoId);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = nome;
        link.click();
      }
    } catch {
      toast({ title: "Erro", description: "Falha ao baixar", variant: "destructive" });
    }
  };

  const handleComparar = async () => {
    if (!versaoA || !versaoB) {
      toast({ title: "Erro", description: "Selecione duas versões", variant: "destructive" });
      return;
    }
    try {
      await onComparar?.(versaoA, versaoB);
      setCompararDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao comparar", variant: "destructive" });
    }
  };

  const versaoAtual = versoes.find(v => v.is_atual);
  const versoesAnteriores = versoes.filter(v => !v.is_atual);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Histórico de Versões - {documentoNome}
        </CardTitle>
        <div className="flex gap-2">
          {versoes.length >= 2 && (
            <Dialog open={compararDialogOpen} onOpenChange={setCompararDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><GitCompare className="h-4 w-4 mr-2" />Comparar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Comparar Versões</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Versão A</label>
                    <select className="w-full mt-1 p-2 border rounded-md" value={versaoA} onChange={e => setVersaoA(e.target.value)}>
                      <option value="">Selecione...</option>
                      {versoes.map(v => <option key={v.id} value={v.id}>v{v.numero_versao} - {format(new Date(v.data_criacao), "dd/MM/yyyy HH:mm")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Versão B</label>
                    <select className="w-full mt-1 p-2 border rounded-md" value={versaoB} onChange={e => setVersaoB(e.target.value)}>
                      <option value="">Selecione...</option>
                      {versoes.map(v => <option key={v.id} value={v.id}>v{v.numero_versao} - {format(new Date(v.data_criacao), "dd/MM/yyyy HH:mm")}</option>)}
                    </select>
                  </div>
                  <Button onClick={handleComparar} className="w-full">Comparar Versões</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {!modoVisualizacao && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Nova Versão</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Nova Versão</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <input type="file" className="w-full mt-1 p-2 border rounded-md" onChange={e => setArquivoNovaVersao(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descrição das Alterações</label>
                    <Textarea value={descricaoNovaVersao} onChange={e => setDescricaoNovaVersao(e.target.value)} placeholder="Descreva as alterações desta versão..." />
                  </div>
                  <Button onClick={handleNovaVersao} className="w-full">Enviar Nova Versão</Button>
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
                    <span className="font-semibold">v{versaoAtual.numero_versao}</span>
                    <Badge>Atual</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{versaoAtual.descricao_alteracao || "Sem descrição"}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" />{versaoAtual.autor_nome}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(versaoAtual.data_criacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                    <span>{formatarTamanho(versaoAtual.tamanho)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onPreview?.(versaoAtual.id)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(versaoAtual.id, `${documentoNome}_v${versaoAtual.numero_versao}`)}><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        )}

        {/* Versões Anteriores */}
        {versoesAnteriores.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Versões Anteriores</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              {versoesAnteriores.map((versao, index) => (
                <div key={versao.id} className="relative pl-10 pb-4">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-muted border-2 border-background" />
                  <div className="p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">v{versao.numero_versao}</span>
                          <span className="text-sm text-muted-foreground">{versao.descricao_alteracao || "Sem descrição"}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{versao.autor_nome}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(versao.data_criacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                          <span>{formatarTamanho(versao.tamanho)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onPreview?.(versao.id)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(versao.id, `${documentoNome}_v${versao.numero_versao}`)}><Download className="h-4 w-4" /></Button>
                        {!modoVisualizacao && (
                          <Button variant="ghost" size="icon" onClick={() => handleRestaurar(versao.id, versao.numero_versao)}><RotateCcw className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {versoes.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhuma versão registrada</p>
        )}

        {/* Info Hash */}
        {versaoAtual && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono">
            Hash: {versaoAtual.hash}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentoVersionamento;
