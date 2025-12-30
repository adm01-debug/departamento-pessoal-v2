import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AumentoWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaboradorId?: string;
  onSuccess?: () => void;
}

export const AumentoWizard = memo(function AumentoWizard({
  open,
  onOpenChange,
  colaboradorId,
  onSuccess,
}: AumentoWizardProps) {
  const [novoSalario, setNovoSalario] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!novoSalario || !motivo) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implementar lógica de aumento
      toast.success('Aumento registrado com sucesso!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao registrar aumento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Aumento Salarial</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="novoSalario">Novo Salário (R$)</Label>
            <Input
              id="novoSalario"
              type="number"
              value={novoSalario}
              onChange={(e) => setNovoSalario(e.target.value)}
              placeholder="0,00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do Aumento</Label>
            <Input
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Mérito, Promoção, Dissídio..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Aumento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default AumentoWizard;
