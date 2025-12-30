import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NovoBeneficioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { nome: string; valor: number; tipo: string }) => void;
}

export const NovoBeneficioModal = memo(function NovoBeneficioModal({
  open,
  onOpenChange,
  onSave
}: NovoBeneficioModalProps) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({ nome, valor: parseFloat(valor), tipo });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Benefício</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <Input id="valor" type="number" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default NovoBeneficioModal;
