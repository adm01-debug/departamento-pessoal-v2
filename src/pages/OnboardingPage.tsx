import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  UserPlus, CheckCircle2, Clock, FileText, Users, Building2,
  GraduationCap, Heart, Laptop, Search, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingItem {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  progresso: number;
  etapas: { id: string; label: string; concluida: boolean; icon: any }[];
  status: 'em_andamento' | 'concluido' | 'pendente';
}

const MOCK_ONBOARDINGS: OnboardingItem[] = [
  {
    id: '1', nome: 'Maria Silva', cargo: 'Analista de RH', departamento: 'Recursos Humanos',
    dataAdmissao: '2026-03-20', progresso: 60, status: 'em_andamento',
    etapas: [
      { id: 'docs', label: 'Documentação', concluida: true, icon: FileText },
      { id: 'acesso', label: 'Acessos e equipamentos', concluida: true, icon: Laptop },
      { id: 'equipe', label: 'Apresentação à equipe', concluida: true, icon: Users },
      { id: 'treinamento', label: 'Treinamentos obrigatórios', concluida: false, icon: GraduationCap },
      { id: 'beneficios', label: 'Cadastro de benefícios', concluida: false, icon: Heart },
    ],
  },
  {
    id: '2', nome: 'João Santos', cargo: 'Desenvolvedor', departamento: 'TI',
    dataAdmissao: '2026-03-18', progresso: 100, status: 'concluido',
    etapas: [
      { id: 'docs', label: 'Documentação', concluida: true, icon: FileText },
      { id: 'acesso', label: 'Acessos e equipamentos', concluida: true, icon: Laptop },
      { id: 'equipe', label: 'Apresentação à equipe', concluida: true, icon: Users },
      { id: 'treinamento', label: 'Treinamentos obrigatórios', concluida: true, icon: GraduationCap },
      { id: 'beneficios', label: 'Cadastro de benefícios', concluida: true, icon: Heart },
    ],
  },
  {
    id: '3', nome: 'Ana Costa', cargo: 'Assistente Financeiro', departamento: 'Financeiro',
    dataAdmissao: '2026-03-25', progresso: 0, status: 'pendente',
    etapas: [
      { id: 'docs', label: 'Documentação', concluida: false, icon: FileText },
      { id: 'acesso', label: 'Acessos e equipamentos', concluida: false, icon: Laptop },
      { id: 'equipe', label: 'Apresentação à equipe', concluida: false, icon: Users },
      { id: 'treinamento', label: 'Treinamentos obrigatórios', concluida: false, icon: GraduationCap },
      { id: 'beneficios', label: 'Cadastro de benefícios', concluida: false, icon: Heart },
    ],
  },
];

function OnboardingCard({ item }: { item: OnboardingItem }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = {
    em_andamento: { label: 'Em Andamento', color: 'bg-warning/10 text-warning border-warning/30' },
    concluido: { label: 'Concluído', color: 'bg-success/10 text-success border-success/30' },
    pendente: { label: 'Pendente', color: 'bg-muted text-muted-foreground border-border' },
  };
  const s = statusConfig[item.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{item.nome}</h3>
            <p className="text-sm text-muted-foreground">{item.cargo} · {item.departamento}</p>
            <p className="text-xs text-muted-foreground">Admissão: {new Date(item.dataAdmissao).toLocaleDateString('pt-BR')}</p>
          </div>
          <Badge variant="outline" className={s.color}>{s.label}</Badge>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{item.progresso}%</span>
          </div>
          <Progress value={item.progresso} className="h-2" />
        </div>

        <Button variant="ghost" size="sm" className="w-full" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Ocultar etapas' : 'Ver etapas'}
        </Button>

        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border">
            {item.etapas.map(etapa => (
              <div key={etapa.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Checkbox checked={etapa.concluida} />
                <etapa.icon className={cn("w-4 h-4", etapa.concluida ? "text-success" : "text-muted-foreground")} />
                <span className={cn("text-sm flex-1", etapa.concluida && "line-through text-muted-foreground")}>
                  {etapa.label}
                </span>
                {etapa.concluida && <CheckCircle2 className="w-4 h-4 text-success" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OnboardingPage(): React.ReactElement {
  const [search, setSearch] = useState('');
  const items = MOCK_ONBOARDINGS.filter(i =>
    i.nome.toLowerCase().includes(search.toLowerCase()) ||
    i.departamento.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: MOCK_ONBOARDINGS.length,
    andamento: MOCK_ONBOARDINGS.filter(i => i.status === 'em_andamento').length,
    concluidos: MOCK_ONBOARDINGS.filter(i => i.status === 'concluido').length,
    pendentes: MOCK_ONBOARDINGS.filter(i => i.status === 'pendente').length,
  };

  return (
    <PageLayout
      title="Onboarding"
      description="Acompanhe a integração de novos colaboradores"
      icon={<UserPlus className="w-6 h-6 text-success" />}
      actions={<Button><UserPlus className="w-4 h-4 mr-2" /> Novo Onboarding</Button>}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'text-primary' },
          { label: 'Em Andamento', value: stats.andamento, icon: Clock, color: 'text-warning' },
          { label: 'Concluídos', value: stats.concluidos, icon: CheckCircle2, color: 'text-success' },
          { label: 'Pendentes', value: stats.pendentes, icon: Building2, color: 'text-muted-foreground' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={cn("w-8 h-8", s.color)} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou departamento..."
          className="pl-10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => <OnboardingCard key={item.id} item={item} />)}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum onboarding encontrado</p>
        </div>
      )}
    </PageLayout>
  );
}
