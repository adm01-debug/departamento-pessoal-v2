import { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Save, Loader2, Camera, Phone, Briefcase, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PerfilPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['meu-perfil', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || '');
      setTelefone(profile.telefone || '');
      setCargo(profile.cargo || '');
      setDepartamento(profile.departamento || '');
    } else if (user?.name) {
      setNome(user.name);
    }
  }, [profile, user?.name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { name: nome } });
      const updateData = { nome, telefone: telefone || null, cargo: cargo || null, departamento: departamento || null };
      if (profile) {
        const { error } = await supabase.from('profiles').update(updateData).eq('id', profile.id);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
      toast.success('Perfil atualizado!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo deve ter no máximo 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: `${publicUrl}?t=${Date.now()}` }).eq('id', profile.id);
      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['meu-perfil'] });
      toast.success('Avatar atualizado!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const initials = (nome || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <PageLayout title="Meu Perfil" description="Gerencie seus dados pessoais" icon={<User className="h-5 w-5 text-white" />} gradient="from-info to-level">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
        <Card className="border border-border/30 rounded-2xl shadow-elevated">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2"><User className="h-5 w-5" />Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <div className="relative group">
                <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={nome} />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-display font-bold text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {uploadingAvatar ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Camera className="h-5 w-5 text-white" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">{nome || 'Usuário'}</p>
                <p className="text-muted-foreground font-body text-sm flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user?.email}</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body flex items-center gap-1.5"><User className="h-3.5 w-3.5" />Nome</Label>
                <Input value={nome} onChange={e => setNome(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-body flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Label>
                <Input value={user?.email || ''} disabled className="rounded-xl bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="font-body flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Telefone</Label>
                <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="font-body flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />Cargo</Label>
                <Input value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Analista de DP" className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="font-body flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Departamento</Label>
                <Input value={departamento} onChange={e => setDepartamento(e.target.value)} placeholder="Ex: Recursos Humanos" className="rounded-xl" />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 font-body">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
