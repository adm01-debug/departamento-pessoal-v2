import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { Network, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const gradients = [
  'from-primary to-primary-glow', 'from-primary to-primary-glow', 'from-primary to-primary-glow',
  'from-primary-glow to-primary', 'from-primary/60 to-primary/90', 'from-primary/80 to-primary',
];

export default function OrganogramaPage() {
  const { empresaAtual } = useEmpresa();

  const { data: departamentos, isLoading } = useQuery({
    queryKey: ['organograma', empresaAtual?.id],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      const { data: deps, error } = await supabase.from('departamentos').select('*').eq('empresa_id', empresaAtual!.id).order('nome');
      if (error) throw error;

      const { data: cols, error: colError } = await supabase.from('colaboradores').select('departamento, cargo, nome_completo').eq('empresa_id', empresaAtual!.id).eq('status', 'ativo');
      if (colError) throw colError;

      return (deps || []).map((d: any) => ({
        ...d,
        colaboradores: (cols || []).filter((c: any) => c.departamento === d.nome),
      }));
    },
  });

  return (
    <PageLayout title="Organograma" description="Estrutura organizacional" icon={<Network className="h-5 w-5 text-primary-foreground" />} gradient="from-primary/80 to-primary">
      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !departamentos?.length ? (
        <div className="text-center py-12">
          <Network className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body">Cadastre departamentos para visualizar o organograma</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <Card className="border border-primary/30 rounded-2xl shadow-glow inline-block">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow"><Briefcase className="h-5 w-5 text-primary-foreground" /></div>
                <div>
                  <p className="font-display font-bold">{empresaAtual?.razao_social || 'Empresa'}</p>
                  <p className="text-muted-foreground font-body text-xs">{departamentos.length} departamentos</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Departments grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departamentos.map((dept: any, i: number) => (
              <motion.div key={dept.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="border border-border/30 rounded-2xl hover:shadow-elevated transition-all overflow-hidden">
                  <div className={cn('h-[2px] bg-gradient-to-r', gradients[i % gradients.length])} />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('p-2 rounded-xl bg-gradient-to-br', gradients[i % gradients.length])}>
                        <Users className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm">{dept.nome}</p>
                        <p className="text-muted-foreground font-body text-xs">{dept.colaboradores?.length || 0} colaboradores</p>
                      </div>
                    </div>
                    {dept.colaboradores?.length > 0 && (
                      <div className="space-y-1.5 pl-2 border-l-2 border-border/30 ml-4">
                        {dept.colaboradores.slice(0, 5).map((c: any, ci: number) => (
                          <div key={ci} className="flex items-center gap-2 text-xs font-body">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            <span className="truncate">{c.nome_completo}</span>
                            <span className="text-muted-foreground/60 truncate ml-auto">{c.cargo}</span>
                          </div>
                        ))}
                        {dept.colaboradores.length > 5 && (
                          <p className="text-[11px] text-muted-foreground/60 font-body pl-3.5">+{dept.colaboradores.length - 5} mais</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
