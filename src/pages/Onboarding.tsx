import { SEOHead } from '@/components/SEOHead';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ClipboardList, 
  Plus, 
  CheckCircle, 
  Clock, 
  User,
  Loader2,
  Play
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useColaboradores } from '@/hooks/useColaboradores';
import { format } from 'date-fns';

interface OnboardingData {
  id: string;
  status: string;
  created_at: string;
  colaboradores?: {
    nome_completo: string;
    cargo: string;
    departamento: string;
  };
}

interface TarefaData {
  id: string;
  titulo: string;
  concluida: boolean;
}

interface OnboardingCardProps {
  onboarding: OnboardingData;
  statusColors: Record<string, string>;
  onToggleTarefa: (id: string, concluida: boolean) => void;
}

export default function Onboarding() {
  useEffect(() => {
    document.title = 'Onboarding | DP System';
  }, []);

  const queryClient = useQueryClient();
  const { colaboradores } = useColaboradores();
  const [selectedColaborador, setSelectedColaborador] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo');

  const { data: onboardings = [], isLoading } = useQuery({
    queryKey: ['onboardings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_colaborador')
        .select(`*, colaboradores(nome_completo, cargo, departamento)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as OnboardingData[];
    }
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['onboarding-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_templates')
        .select(`*, onboarding_template_tarefas(*)`)
        .eq('ativo', true);
      if (error) throw error;
      return data;
    }
  });

  const iniciarMutation = useMutation({
    mutationFn: async (colaboradorId: string) => {
      const template = templates[0] as any;
      if (!template) throw new Error('Nenhum template encontrado');

      const { data: onboarding, error: onbError } = await supabase
        .from('onboarding_colaborador')
        .insert({ colaborador_id: colaboradorId, template_id: template.id })
        .select()
        .single();
      if (onbError) throw onbError;

      const tarefas = template.onboarding_template_tarefas.map((t: any) => ({
        onboarding_id: onboarding.id,
        template_tarefa_id: t.id,
        titulo: t.titulo,
        descricao: t.descricao,
        categoria: t.categoria,
        ordem: t.ordem,
        data_prazo: new Date(Date.now() + t.dias_prazo * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      const { error: tarefasError } = await supabase
        .from('onboarding_tarefas')
        .insert(tarefas);
      if (tarefasError) throw tarefasError;

      return onboarding;
    },
    onSuccess: () => {
      toast.success('Onboarding iniciado!');
      queryClient.invalidateQueries({ queryKey: ['onboardings'] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error('Erro ao iniciar onboarding')
  });

  const concluirTarefaMutation = useMutation({
    mutationFn: async ({ tarefaId, concluida }: { tarefaId: string; concluida: boolean }) => {
      const { error } = await supabase
        .from('onboarding_tarefas')
        .update({ 
          concluida, 
          data_conclusao: concluida ? new Date().toISOString() : null 
        })
        .eq('id', tarefaId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['onboardings'] })
  });

  const statusColors: Record<string, string> = {
    em_andamento: 'bg-info/20 text-info',
    concluido: 'bg-success/20 text-success',
    pausado: 'bg-warning/20 text-warning'
  };

  return (
    <>
      <SEOHead title="Onboarding" description="Processo de integração" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
              Onboarding
            </h1>
            <p className="text-muted-foreground">Acompanhe a integração de novos colaboradores</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Iniciar Onboarding</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Iniciar Onboarding</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Select value={selectedColaborador} onValueChange={setSelectedColaborador}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradoresAtivos.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full" 
                  disabled={!selectedColaborador || iniciarMutation.isPending}
                  onClick={() => iniciarMutation.mutate(selectedColaborador)}
                >
                  {iniciarMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Iniciar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : onboardings.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum onboarding em andamento</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {onboardings.map((onb) => (
              <OnboardingCard 
                key={onb.id} 
                onboarding={onb} 
                statusColors={statusColors}
                onToggleTarefa={(id, concluida) => concluirTarefaMutation.mutate({ tarefaId: id, concluida })}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function OnboardingCard({ onboarding, statusColors, onToggleTarefa }: OnboardingCardProps) {
  const { data: tarefas = [] } = useQuery({
    queryKey: ['onboarding-tarefas', onboarding.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_tarefas')
        .select('*')
        .eq('onboarding_id', onboarding.id)
        .order('ordem');
      if (error) throw error;
      return data as TarefaData[];
    }
  });

  const concluidas = tarefas.filter((t) => t.concluida).length;
  const progresso = tarefas.length > 0 ? (concluidas / tarefas.length) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{onboarding.colaboradores?.nome_completo}</CardTitle>
          <Badge className={statusColors[onboarding.status]}>{onboarding.status}</Badge>
        </div>
        <CardDescription>{onboarding.colaboradores?.cargo} - {onboarding.colaboradores?.departamento}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso</span>
            <span>{concluidas}/{tarefas.length}</span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tarefas.map((tarefa) => (
            <div key={tarefa.id} className="flex items-center gap-2 text-sm">
              <Checkbox 
                checked={tarefa.concluida} 
                onCheckedChange={(checked) => onToggleTarefa(tarefa.id, checked as boolean)}
              />
              <span className={tarefa.concluida ? 'line-through text-muted-foreground' : ''}>
                {tarefa.titulo}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Iniciado em {format(new Date(onboarding.created_at), 'dd/MM/yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}
