/**
 * @fileoverview Modal de férias
 * @module components/ferias/FeriasModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Palmtree, Save, Calculator } from 'lucide-react';

interface FeriasData {
  id?: string;
  colaboradorId: string;
  dataInicio: string;
  dataFim: string;
  diasGozo: number;
  diasAbono: number;
  adiantamento13: boolean;
}

interface FeriasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ferias?: FeriasData | null;
  colaboradores: { id: string; nome: string }[];
  onSave: (data: FeriasData) => void;
}

const initialData: FeriasData = {
  colaboradorId: '', dataInicio: '', dataFim: '', diasGozo: 30, diasAbono: 0, adiantamento13: false
};

export const FeriasModal = memo(function FeriasModal({
  open, onOpenChange, ferias, colaboradores, onSave
}: FeriasModalProps) {
  const [formData, setFormData] = useState<FeriasData>(initialData);
  const isEditing = !!ferias?.id;

  useEffect(() => {
    if (ferias) setFormData(ferias);
    else setFormData(initialData);
  }, [ferias, open]);

  const calcularDataFim = (inicio: string, dias: number) => {
    if (!inicio) return '';
    const d = new Date(inicio + 'T00:00:00');
    d.setDate(d.getDate() + dias - 1);
    return d.toISOString().split('T')[0];
  };

  const handleDiasChange = (dias: number) => {
    const diasGozo = Math.min(30, Math.max(5, dias));
    setFormData(prev => ({
      ...prev,
      diasGozo,
      dataFim: calcularDataFim(prev.dataInicio, diasGozo)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palmtree className="h-5 w-5" />
            {isEditing ? 'Editar Férias' : 'Programar Férias'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={formData.colaboradorId} onValueChange={v => setFormData({...formData, colaboradorId: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {colaboradores.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input type="date" value={formData.dataInicio} onChange={e => setFormData({...formData, dataInicio: e.target.value, dataFim: calcularDataFim(e.target.value, formData.diasGozo)})} required />
            </div>
            <div className="space-y-2">
              <Label>Dias de Gozo</Label>
              <Input type="number" min={5} max={30} value={formData.diasGozo} onChange={e => handleDiasChange(parseInt(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input type="date" value={formData.dataFim} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Abono Pecuniário (dias)</Label>
              <Input type="number" min={0} max={10} value={formData.diasAbono} onChange={e => setFormData({...formData, diasAbono: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <Label>Adiantamento 13º Salário</Label>
            <Switch checked={formData.adiantamento13} onCheckedChange={c => setFormData({...formData, adiantamento13: c})} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit"><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
