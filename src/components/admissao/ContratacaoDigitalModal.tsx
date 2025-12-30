import { useState, memo, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { 
  Link2, Copy, Send, Mail, MessageCircle, CheckCircle2, 
  Clock, FileText, Upload, PenTool, RefreshCw, ExternalLink,
  Eye, FileCheck, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useContratacaoDigital } from '@/hooks/useContratacaoDigital';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface ContratacaoDigitalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admissao: {
    id: string;
    nome: string;
    email?: string;
    telefone?: string;
  } | null;
}

export const ContratacaoDigitalModal = memo(function ContratacaoDigitalModal({ 
  open, 
  onOpenChange, 
  admissao 
}: ContratacaoDigitalModalProps) {
  const [tokenData, setTokenData] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { 
    criarToken, 
    getTokenByAdmissao, 
    getDocumentosAdmissao,
    gerarLinkContratacao,
    copiarLink,
    isCriando,
    reenviarToken,
    isReenviando,
  } = useContratacaoDigital();

  useEffect(() => {
    if (open && admissao) {
      loadData();
    }
  }, [open, admissao]);

  const loadData = async () => {
    if (!admissao) return;
    setLoading(true);
    try {
      const token = await getTokenByAdmissao(admissao.id);
      setTokenData(token);
      
      if (token) {
        const docs = await getDocumentosAdmissao(admissao.id);
        setDocumentos(docs ?? []);
      }
    } catch (error) {
      logger.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarLink = () => {
    if (!admissao) return;
    criarToken({
      admissaoId: admissao.id,
      email: admissao.email,
      telefone: admissao.telefone,
    }, {
      onSuccess: () => {
        loadData();
      }
    });
  };

  const handleCopiarLink = async () => {
    if (tokenData?.token) {
      await copiarLink(tokenData.token);
    }
  };

  const handleAbrirLink = () => {
    if (tokenData?.token) {
      window.open(gerarLinkContratacao(tokenData.token), '_blank');
    }
  };

  const getProgresso = () => {
    if (!tokenData) return 0;
    let progress = 0;
    if (tokenData.dados_preenchidos) progress += 25;
    if (tokenData.documentos_enviados) progress += 25;
    if (tokenData.contrato_gerado) progress += 25;
    if (tokenData.contrato_assinado) progress += 25;
    return progress;
  };

  const getStatusBadge = () => {
    if (!tokenData) return null;
    
    if (tokenData.contrato_assinado) {
      return <Badge className="bg-success/10 text-success border-success"><CheckCircle2 className="w-3 h-3 mr-1" />Concluído</Badge>;
    }
    if (new Date(tokenData.data_expiracao) < new Date()) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expirado</Badge>;
    }
    return <Badge variant="outline" className="text-warning border-warning"><Clock className="w-3 h-3 mr-1" />Em Andamento</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Contratação Digital
          </DialogTitle>
          <DialogDescription>
            {admissao?.nome} - Link de autopreenchimento e assinatura digital
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !tokenData ? (
          // Sem token criado ainda
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Link2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Iniciar Contratação Digital</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Gere um link único para que o candidato preencha seus dados, 
                envie documentos e assine o contrato digitalmente.
              </p>
            </div>
            <Button onClick={handleCriarLink} disabled={isCriando}>
              {isCriando ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Link2 className="w-4 h-4 mr-2" />}
              Gerar Link de Contratação
            </Button>
          </div>
        ) : (
          // Token existe
          <Tabs defaultValue="link" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="progresso">Progresso</TabsTrigger>
              <TabsTrigger value="documentos">Documentos ({documentos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4 mt-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge()}
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label>Link de Acesso</Label>
                <div className="flex gap-2">
                  <Input 
                    value={gerarLinkContratacao(tokenData.token)} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button variant="outline" size="icon" aria-label="Copiar link" onClick={handleCopiarLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Abrir link" onClick={handleAbrirLink}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Expiração */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expira em:</span>
                <span className="font-medium">
                  {format(new Date(tokenData.data_expiracao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>

              <Separator />

              {/* Ações */}
              <div className="space-y-2">
                <Label>Enviar Link</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const link = gerarLinkContratacao(tokenData.token);
                      window.open(`mailto:${admissao?.email}?subject=Contratação Digital&body=Olá ${admissao?.nome},%0A%0AClique no link abaixo para preencher seus dados e assinar seu contrato:%0A${link}`, '_blank');
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const link = gerarLinkContratacao(tokenData.token);
                      const phone = admissao?.telefone?.replace(/\D/g, '');
                      const message = encodeURIComponent(`Olá ${admissao?.nome}!\n\nClique no link abaixo para preencher seus dados e assinar seu contrato:\n${link}`);
                      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              {/* Reenviar */}
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => reenviarToken(admissao!.id, { onSuccess: loadData })}
                  disabled={isReenviando}
                >
                  {isReenviando ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Gerar Novo Link
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="progresso" className="space-y-4 mt-4">
              {/* Progresso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso Geral</span>
                  <span className="text-sm text-muted-foreground">{getProgresso()}%</span>
                </div>
                <Progress value={getProgresso()} className="h-2" />
              </div>

              {/* Etapas */}
              <div className="space-y-3">
                {[
                  { 
                    key: 'dados_preenchidos', 
                    label: 'Dados Pessoais', 
                    icon: FileText,
                    done: tokenData.dados_preenchidos 
                  },
                  { 
                    key: 'documentos_enviados', 
                    label: 'Documentos Enviados', 
                    icon: Upload,
                    done: tokenData.documentos_enviados 
                  },
                  { 
                    key: 'contrato_gerado', 
                    label: 'Contrato Gerado', 
                    icon: FileCheck,
                    done: tokenData.contrato_gerado 
                  },
                  { 
                    key: 'contrato_assinado', 
                    label: 'Contrato Assinado', 
                    icon: PenTool,
                    done: tokenData.contrato_assinado 
                  },
                ].map(({ key, label, icon: Icon, done }) => (
                  <div 
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      done ? 'bg-success/5 border-success/20' : 'bg-muted/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      done ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm ${done ? 'font-medium' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                    {done && (
                      <Badge variant="outline" className="ml-auto text-success border-success text-xs">
                        Concluído
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="mt-4">
              <ScrollArea className="h-[300px]">
                {documentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum documento enviado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documentos.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.validado ? 'bg-success/10 text-success' : 'bg-muted'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.tipo.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.nome_arquivo}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
});