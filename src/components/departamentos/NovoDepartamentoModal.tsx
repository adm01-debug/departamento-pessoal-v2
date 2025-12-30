import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NovoDepartamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovoDepartamentoModal({ open, onOpenChange }: NovoDepartamentoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Departamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Nome do departamento" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gestor">Gestor</Label>
            <Input id="gestor" placeholder="Nome do gestor" />
          </div>
          <Button className="w-full">Criar Departamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
