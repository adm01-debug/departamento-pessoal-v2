import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PerfilPage() {
  const { user } = useAuth();
  const [nome, setNome] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user?.name) setNome(user.name); }, [user?.name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { name: nome } });
      if (error) throw error;
      await supabase.from('profiles').update({ nome }).eq('user_id', user.id);
      toast.success('Perfil atualizado!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout title="Meu Perfil" description="Gerencie seus dados pessoais" icon={<User className="h-5 w-5 text-white" />} gradient="from-info to-level">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <Card className="border border-border/30 rounded-2xl shadow-elevated">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><User className="h-5 w-5" />Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                {(nome || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-display font-semibold text-lg">{nome || 'Usuário'}</p>
                <p className="text-muted-foreground font-body text-sm flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Nome</Label>
              <Input value={nome} onChange={e => setNome(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Email</Label>
              <Input value={user?.email || ''} disabled className="rounded-xl bg-muted/30" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-body">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Salvar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
