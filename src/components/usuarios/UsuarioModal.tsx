/**
 * @fileoverview Modal de usuário
 * @module components/usuarios/UsuarioModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Save } from 'lucide-react';

interface UsuarioData { id?: string; nome: string; email: string; perfil: 'admin' | 'gestor' | 'usuario'; ativo: boolean; }
interface UsuarioModalProps { open: boolean; onOpenChange: (open: boolean) => void; usuario?: UsuarioData | null; onSave: (data: UsuarioData) => void; }

const initialData: UsuarioData = { nome: '', email: '', perfil: 'usuario', ativo: true };

export const UsuarioModal = memo(function UsuarioModal({ open, onOpenChange, usuario, onSave }: UsuarioModalProps) {
  const [formData, setFormData] = useState<UsuarioData>(initialData);
  const isEditing = !!usuario?.id;

  useEffect(() => {
    if (usuario) setFormData(usuario);
    else setFormData(initialData);
  }, [usuario, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><User className="h-5 w-5" />{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
          <div className="space-y-2">
            <Label>Perfil</Label>
            <Select value={formData.perfil} onValueChange={(v: UsuarioData['perfil']) => setFormData({...formData, perfil: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg"><Label>Usuário Ativo</Label><Switch checked={formData.ativo} onCheckedChange={c => setFormData({...formData, ativo: c})} /></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit"><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
