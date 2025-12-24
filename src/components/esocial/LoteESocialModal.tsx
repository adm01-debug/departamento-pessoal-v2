/**
 * @fileoverview Modal de lote eSocial
 * @module components/esocial/LoteESocialModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Package, Send, AlertCircle } from 'lucide-react';

interface Evento {
  id: string;
  tipo: string;
  descricao: string;
  status: 'pendente' | 'enviado' | 'erro';
}

interface LoteESocialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventos: Evento[];
  onEnviar: (eventoIds: string[], ambiente: 'producao' | 'homologacao') => void;
}

/**
 * Modal para criação e envio de lote eSocial
 */
export const LoteESocialModal = memo(function LoteESocialModal({
  open, onOpenChange, eventos, onEnviar
}: LoteESocialModalProps) {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [ambiente, setAmbiente] = useState<'producao' | 'homologacao'>('homologacao');

  const eventosPendentes = eventos.filter(e => e.status === 'pendente');

  const toggleEvento = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTodos = () => {
    if (selecionados.length === eventosPendentes.length) {
      setSelecionados([]);
    } else {
      setSelecionados(eventosPendentes.map(e => e.id));
    }
  };

  const handleEnviar = () => {
    if (selecionados.length > 0) {
      onEnviar(selecionados, ambiente);
      setSelecionados([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Criar Lote eSocial
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ambiente</Label>
              <Select value={ambiente} onValueChange={(v: 'producao' | 'homologacao') => setAmbiente(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="homologacao">Homologação</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Badge variant={ambiente === 'producao' ? 'destructive' : 'secondary'}>
                {ambiente === 'producao' ? 'PRODUÇÃO' : 'TESTE'}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Eventos Pendentes ({eventosPendentes.length})</Label>
              <Button variant="ghost" size="sm" onClick={toggleTodos}>
                {selecionados.length === eventosPendentes.length ? 'Desmarcar' : 'Selecionar'} Todos
              </Button>
            </div>
            <ScrollArea className="h-64 border rounded-md p-2">
              {eventosPendentes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Nenhum evento pendente
                </div>
              ) : (
                <div className="space-y-2">
                  {eventosPendentes.map(evento => (
                    <div key={evento.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                      <Checkbox 
                        checked={selecionados.includes(evento.id)} 
                        onCheckedChange={() => toggleEvento(evento.id)} 
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{evento.tipo}</p>
                        <p className="text-xs text-muted-foreground">{evento.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleEnviar} disabled={selecionados.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Enviar {selecionados.length} Evento(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
