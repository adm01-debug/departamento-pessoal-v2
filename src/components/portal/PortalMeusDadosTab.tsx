import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, Edit, Shield, Eye, BellRing, Smartphone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface PortalMeusDadosTabProps {
  nome: string;
  email: string;
  profile: any;
  userId: string;
  navigate: (path: string) => void;
}

export function PortalMeusDadosTab({ nome, email, profile, userId, navigate }: PortalMeusDadosTabProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ telefone: '', endereco: '' });
  const queryClient = useQueryClient();

  const salvarDados = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('profiles').update({
        telefone: editForm.telefone || undefined,
      }).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-completo'] });
      setEditOpen(false);
      toast.success('Dados atualizados com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar dados'),
  });

  const campos = [
    { label: 'Nome', value: nome },
    { label: 'Email', value: email || '—' },
    { label: 'Cargo', value: profile?.cargo || '—' },
    { label: 'Departamento', value: profile?.departamento || '—' },
    { label: 'Telefone', value: profile?.telefone || '—' },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      <Card className="border border-border/30 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-primary" />Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campos.map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
              <span className="text-sm text-muted-foreground font-body">{item.label}</span>
              <span className="text-sm font-body font-medium">{item.value}</span>
            </div>
          ))}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full rounded-xl mt-2"><Edit className="h-4 w-4 mr-2" />Solicitar Alteração de Dados</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Atualizar Dados Pessoais</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Telefone</Label><Input value={editForm.telefone} onChange={e => setEditForm(p => ({ ...p, telefone: e.target.value }))} placeholder="(11) 99999-9999" /></div>
                <div><Label>Endereço Atualizado</Label><Textarea value={editForm.endereco} onChange={e => setEditForm(p => ({ ...p, endereco: e.target.value }))} placeholder="Rua, número, bairro, cidade" /></div>
                <Button className="w-full" onClick={() => salvarDados.mutate()} disabled={salvarDados.isPending}>{salvarDados.isPending ? 'Salvando...' : 'Salvar Alterações'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="border border-border/30 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm font-display flex items-center gap-2"><Shield className="h-4 w-4 text-info" />Segurança & Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => navigate('/perfil')}>
            <Shield className="h-4 w-4 mr-2" />Alterar Senha
          </Button>
          <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => navigate('/lgpd')}>
            <Eye className="h-4 w-4 mr-2" />Meus Dados LGPD
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
