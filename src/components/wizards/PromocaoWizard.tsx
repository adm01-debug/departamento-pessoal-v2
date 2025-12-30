import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PromocaoWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaboradorId?: string;
  onSuccess?: () => void;
}

export const PromocaoWizard = memo(function PromocaoWizard({
  open,
  onOpenChange,
  colaboradorId,
  onSuccess,
}: PromocaoWizardProps) {
  const [novoCargo, setNovoCargo] = useState('');
  const [novoDepartamento, setNovoDepartamento] = useState('');
  const [novoSalario, setNovoSalario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!novoCargo) {
      toast.error('Selecione o novo cargo');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implementar lógica de promoção
      toast.success('Promoção registrada com sucesso!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao registrar promoção');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Promoção</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="novoCargo">Novo Cargo</Label>
            <Input
              id="novoCargo"
              value={novoCargo}
              onChange={(e) => setNovoCargo(e.target.value)}
              placeholder="Digite o novo cargo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="novoDepartamento">Novo Departamento (opcional)</Label>
            <Input
              id="novoDepartamento"
              value={novoDepartamento}
              onChange={(e) => setNovoDepartamento(e.target.value)}
              placeholder="Manter atual ou alterar"
            />
          </div>
          
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Promoção'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default PromocaoWizard;
