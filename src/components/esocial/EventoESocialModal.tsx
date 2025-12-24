/**
 * @fileoverview Modal de Evento eSocial
 * @module components/esocial/EventoESocialModal
 * @description Modal para visualização detalhada e edição de eventos eSocial
 */

import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Code, 
  History, 
  Send,
  Download,
  Copy,
  CheckCircle
} from 'lucide-react';

/**
 * Histórico do evento
 */
interface EventoHistorico {
  data: string;
  acao: string;
  usuario: string;
  detalhes?: string;
}

/**
 * Props do EventoESocialModal
 */
interface EventoESocialModalProps {
  /** Modal aberto */
  open: boolean;
  /** Callback ao fechar */
  onClose: () => void;
  /** Código do evento */
  codigo: string;
  /** Descrição do evento */
  descricao: string;
  /** XML do evento */
  xml: string;
  /** Status atual */
  status: string;
  /** Histórico de alterações */
  historico: EventoHistorico[];
  /** Callback ao enviar */
  onSend?: () => void;
  /** Callback ao baixar XML */
  onDownload?: () => void;
}

/**
 * Modal de Evento eSocial
 * @param props - Propriedades do componente
 * @returns Modal com detalhes do evento
 */
function EventoESocialModalComponent({
  open,
  onClose,
  codigo,
  descricao,
  xml,
  status,
  historico,
  onSend,
  onDownload
}: EventoESocialModalProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle className="text-xl">{codigo}</DialogTitle>
              <p className="text-sm text-muted-foreground">{descricao}</p>
            </div>
            <Badge className="ml-auto">{status}</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="xml" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xml" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              XML
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xml" className="mt-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="absolute right-2 top-2 z-10"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <ScrollArea className="h-[400px] rounded-md border">
                <Textarea
                  value={xml}
                  readOnly
                  className="min-h-[400px] font-mono text-xs resize-none border-0"
                />
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {historico.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.acao}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.data}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        por {item.usuario}
                      </p>
                      {item.detalhes && (
                        <p className="text-sm mt-1">{item.detalhes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Baixar XML
          </Button>
          {status === 'Pendente' && (
            <Button onClick={onSend}>
              <Send className="h-4 w-4 mr-2" />
              Enviar ao eSocial
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const EventoESocialModal = memo(EventoESocialModalComponent);
