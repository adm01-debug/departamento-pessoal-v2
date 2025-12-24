/**
 * @fileoverview Modal de registro de ponto
 * @module components/ponto/RegistroPontoModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Save } from 'lucide-react';

interface RegistroPontoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaboradores: { id: string; nome: string }[];
  onSave: (data: { colaboradorId: string; data: string; hora: string; tipo: string; justificativa?: string }) => void;
}

export const RegistroPontoModal = memo(function RegistroPontoModal({
  open, onOpenChange, colaboradores, onSave
}: RegistroPontoModalProps) {
  const [formData, setFormData] = useState({ colaboradorId: '', data: '', hora: '', tipo: 'entrada', justificativa: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ colaboradorId: '', data: '', hora: '', tipo: 'entrada', justificativa: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Registro Manual de Ponto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select value={formData.colaboradorId} onValueChange={v => setFormData({...formData, colaboradorId: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{colaboradores.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Data</Label><Input type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Hora</Label><Input type="time" value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} required /></div>
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={formData.tipo} onValueChange={v => setFormData({...formData, tipo: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="intervalo_inicio">Início Intervalo</SelectItem>
                <SelectItem value="intervalo_fim">Fim Intervalo</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Justificativa</Label><Textarea value={formData.justificativa} onChange={e => setFormData({...formData, justificativa: e.target.value})} placeholder="Motivo do registro manual" /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit"><Save className="h-4 w-4 mr-2" />Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
