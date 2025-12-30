import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NovoDesligamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovoDesligamentoModal({ open, onOpenChange }: NovoDesligamentoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Desligamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="colaborador">Colaborador</Label>
            <Input id="colaborador" placeholder="Selecione o colaborador" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Desligamento</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demissao_sem_justa_causa">Demissão sem justa causa</SelectItem>
                <SelectItem value="demissao_com_justa_causa">Demissão com justa causa</SelectItem>
                <SelectItem value="pedido_demissao">Pedido de demissão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data de Desligamento</Label>
            <Input id="data" type="date" />
          </div>
          <Button className="w-full">Registrar Desligamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
