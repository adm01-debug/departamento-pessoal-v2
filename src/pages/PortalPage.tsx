import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Calendar, Clock, FileText, DollarSign, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const quickActions = [
  { label: 'Registrar Ponto', icon: Clock, path: '/ponto', gradient: 'from-info to-primary' },
  { label: 'Solicitar Férias', icon: Calendar, path: '/ferias', gradient: 'from-warning to-warning/70' },
  { label: 'Meus Documentos', icon: FileText, path: '/documentos', gradient: 'from-success to-success/70' },
  { label: 'Holerites', icon: DollarSign, path: '/folha', gradient: 'from-primary to-primary/70' },
  { label: 'Afastamentos', icon: Heart, path: '/afastamentos', gradient: 'from-destructive to-destructive/70' },
  { label: 'Meu Perfil', icon: UserCircle, path: '/perfil', gradient: 'from-info to-info/70' },
];

export default function PortalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['my-profile', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();
      return data;
    },
  });

  return (
    <PageLayout
      title="Meu Portal"
      description={`Bem-vindo, ${profile?.nome || user?.email || 'Colaborador'}`}
      icon={<UserCircle className="h-5 w-5 text-primary-foreground" />}
      gradient="from-success to-primary"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map(({ label, icon: Icon, path, gradient }, i) => (
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden"
              onClick={() => navigate(path)}
            >
              <div className={cn("h-[2px] bg-gradient-to-r opacity-60 group-hover:opacity-100 transition-opacity", gradient)} />
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", gradient)}>
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-display font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground font-body">Acesse rapidamente</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
}
