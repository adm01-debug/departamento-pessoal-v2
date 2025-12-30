import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowRightLeft } from 'lucide-react';

interface TransferenciaWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaboradorId?: string;
  colaboradorNome?: string;
  onSuccess?: () => void;
}

export const TransferenciaWizard = memo(function TransferenciaWizard({
  open,
  onOpenChange,
  colaboradorId,
  colaboradorNome,
  onSuccess,
}: TransferenciaWizardProps) {
  const [tipoTransferencia, setTipoTransferencia] = useState('');
  const [destino, setDestino] = useState('');
  const [dataEfetivacao, setDataEfetivacao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tipoTransferencia || !destino || !dataEfetivacao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implementar lógica de transferência
      toast.success('Transferência registrada com sucesso!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao registrar transferência');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Transferência de Colaborador
          </DialogTitle>
          {colaboradorNome && (
            <DialogDescription>
              Colaborador: {colaboradorNome}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tipoTransferencia">Tipo de Transferência</Label>
            <Select value={tipoTransferencia} onValueChange={setTipoTransferencia}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departamento">Entre Departamentos</SelectItem>
                <SelectItem value="filial">Entre Filiais</SelectItem>
                <SelectItem value="cargo">Mudança de Cargo</SelectItem>
                <SelectItem value="gestor">Mudança de Gestor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destino">Destino</Label>
            <Input
              id="destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Novo departamento, filial ou cargo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataEfetivacao">Data de Efetivação</Label>
            <Input
              id="dataEfetivacao"
              type="date"
              value={dataEfetivacao}
              onChange={(e) => setDataEfetivacao(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo (opcional)</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo da transferência..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Transferência'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default TransferenciaWizard;
