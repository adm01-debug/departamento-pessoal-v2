/**
 * @fileoverview Modal de feriado
 * @module components/feriados/FeriadoModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Save } from 'lucide-react';

interface FeriadoData {
  id?: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'facultativo';
  recorrente: boolean;
}

interface FeriadoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feriado?: FeriadoData | null;
  onSave: (data: FeriadoData) => void;
}

const initialData: FeriadoData = {
  nome: '', data: '', tipo: 'nacional', recorrente: true
};

/**
 * Modal de cadastro/edição de feriado
 */
export const FeriadoModal = memo(function FeriadoModal({
  open, onOpenChange, feriado, onSave
}: FeriadoModalProps) {
  const [formData, setFormData] = useState<FeriadoData>(initialData);
  const isEditing = !!feriado?.id;

  useEffect(() => {
    if (feriado) setFormData(feriado);
    else setFormData(initialData);
  }, [feriado, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? 'Editar Feriado' : 'Novo Feriado'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={formData.tipo} onValueChange={(v: FeriadoData['tipo']) => setFormData({...formData, tipo: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nacional">Nacional</SelectItem>
                <SelectItem value="estadual">Estadual</SelectItem>
                <SelectItem value="municipal">Municipal</SelectItem>
                <SelectItem value="facultativo">Facultativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="recorrente">Recorrente (todo ano)</Label>
            <Switch id="recorrente" checked={formData.recorrente} onCheckedChange={c => setFormData({...formData, recorrente: c})} />
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
