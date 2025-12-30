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

interface NovoCargoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { nome: string; departamento: string; salarioBase: number }) => void;
}

export const NovoCargoModal = memo(function NovoCargoModal({
  open,
  onOpenChange,
  onSave
}: NovoCargoModalProps) {
  const [nome, setNome] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [salarioBase, setSalarioBase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({ nome, departamento, salarioBase: parseFloat(salarioBase) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cargo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cargo</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input id="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salarioBase">Salário Base</Label>
            <Input id="salarioBase" type="number" value={salarioBase} onChange={(e) => setSalarioBase(e.target.value)} required />
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

export default NovoCargoModal;
