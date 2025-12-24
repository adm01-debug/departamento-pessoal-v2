/**
 * @fileoverview Modal para cadastro/edição de cargo
 * @module components/cargo/CargoModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CargoForm {
  nome: string;
  departamentoId?: string;
  cbo?: string;
  salarioBase?: number;
  descricao?: string;
  ativo: boolean;
}

interface CargoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cargo?: CargoForm & { id?: string };
  departamentos?: { id: string; nome: string; }[];
  onSuccess?: () => void;
}

/**
 * Modal de cargo com formulário completo
 */
export const CargoModal = memo(function CargoModal({
  open, onOpenChange, cargo, departamentos = [], onSuccess
}: CargoModalProps) {
  const [form, setForm] = useState<CargoForm>({ nome: '', ativo: true });
  const [loading, setLoading] = useState(false);
  const isEditing = !!cargo?.id;

  useEffect(() => {
    if (cargo) setForm(cargo);
    else setForm({ nome: '', ativo: true });
  }, [cargo, open]);

  const handleSubmit = async () => {
    if (!form.nome) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cargo' : 'Novo Cargo'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Nome do Cargo *</Label>
            <Input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} placeholder="Ex: Analista de RH" />
          </div>
          <div>
            <Label>Departamento</Label>
            <Select value={form.departamentoId} onValueChange={(v) => setForm({...form, departamentoId: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {departamentos.map(d => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CBO</Label>
              <Input value={form.cbo || ''} onChange={(e) => setForm({...form, cbo: e.target.value})} placeholder="Ex: 2524-05" />
            </div>
            <div>
              <Label>Salário Base</Label>
              <Input type="number" value={form.salarioBase || ''} onChange={(e) => setForm({...form, salarioBase: +e.target.value})} placeholder="0,00" />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={form.descricao || ''} onChange={(e) => setForm({...form, descricao: e.target.value})} placeholder="Responsabilidades e requisitos..." rows={3} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Cargo Ativo</Label>
            <Switch checked={form.ativo} onCheckedChange={(v) => setForm({...form, ativo: v})} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!form.nome || loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
