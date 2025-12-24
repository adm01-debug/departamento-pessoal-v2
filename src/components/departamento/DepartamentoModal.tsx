/**
 * @fileoverview Modal para cadastro/edição de departamento
 * @module components/departamento/DepartamentoModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartamentoForm {
  nome: string;
  sigla?: string;
  gestorId?: string;
  centroCusto?: string;
  descricao?: string;
  ativo: boolean;
}

interface DepartamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departamento?: DepartamentoForm & { id?: string };
  colaboradores?: { id: string; nome: string; }[];
  onSuccess?: () => void;
}

/**
 * Modal de departamento
 */
export const DepartamentoModal = memo(function DepartamentoModal({
  open, onOpenChange, departamento, colaboradores = [], onSuccess
}: DepartamentoModalProps) {
  const [form, setForm] = useState<DepartamentoForm>({ nome: '', ativo: true });
  const [loading, setLoading] = useState(false);
  const isEditing = !!departamento?.id;

  useEffect(() => {
    if (departamento) setForm(departamento);
    else setForm({ nome: '', ativo: true });
  }, [departamento, open]);

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
          <DialogTitle>{isEditing ? 'Editar Departamento' : 'Novo Departamento'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} placeholder="Ex: Recursos Humanos" />
            </div>
            <div>
              <Label>Sigla</Label>
              <Input value={form.sigla || ''} onChange={(e) => setForm({...form, sigla: e.target.value.toUpperCase()})} placeholder="RH" maxLength={5} />
            </div>
          </div>
          <div>
            <Label>Gestor</Label>
            <Select value={form.gestorId} onValueChange={(v) => setForm({...form, gestorId: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione o gestor" /></SelectTrigger>
              <SelectContent>
                {colaboradores.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Centro de Custo</Label>
            <Input value={form.centroCusto || ''} onChange={(e) => setForm({...form, centroCusto: e.target.value})} placeholder="Ex: CC-001" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={form.descricao || ''} onChange={(e) => setForm({...form, descricao: e.target.value})} rows={2} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Departamento Ativo</Label>
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
