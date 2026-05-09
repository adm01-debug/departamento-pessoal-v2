import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, DollarSign, FileText, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { PortalOverviewTab } from '@/components/portal/PortalOverviewTab';
import { PortalFinanceiroTab } from '@/components/portal/PortalFinanceiroTab';
import { PortalDocumentosTab } from '@/components/portal/PortalDocumentosTab';
import { PortalMeusDadosTab } from '@/components/portal/PortalMeusDadosTab';

function usePortalCompleto(userId: string | undefined) {
  return useQuery({
    queryKey: ['portal-completo', userId],
    enabled: !!userId,
    staleTime: 3 * 60 * 1000,
    queryFn: async () => {
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const [{ data: profile }, { data: notificacoes }, { data: pontoHoje }, { data: feriasPendentes }, { data: holerites }, { data: beneficios }, { data: comunicados }, { data: treinamentos }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId!).maybeSingle(),
        supabase.from('notificacoes').select('id, titulo, mensagem, lida, created_at, tipo').eq('user_id', userId!).eq('lida', false).order('created_at', { ascending: false }).limit(8),
        supabase.from('registros_ponto').select('entrada_1, saida_1, entrada_2, saida_2, horas_trabalhadas, horas_extras, atraso_minutos').eq('data', hoje).limit(1).maybeSingle(),
        supabase.from('ferias').select('data_inicio, data_fim, status, dias_total').in('status', ['pendente', 'aprovada']).order('data_inicio', { ascending: true }).limit(5),
        supabase.from('folhas_pagamento' as any).select('competencia, total_liquido, total_proventos').order('competencia', { ascending: false }).limit(3),
        supabase.from('beneficios').select('nome, tipo, valor, status').eq('status', 'ativo').limit(6),
        supabase.from('comunicados' as any).select('id, titulo, tipo, created_at').eq('ativo', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('treinamentos' as any).select('id, nome, status, data_inicio').in('status', ['pendente', 'em_andamento']).limit(3),
      ]);
      return { profile, notificacoes: notificacoes || [], pontoHoje, feriasPendentes: feriasPendentes || [], holerites: holerites || [], beneficios: beneficios || [], comunicados: comunicados || [], treinamentos: treinamentos || [] };
    },
  });
}

export default function PortalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = usePortalCompleto(user?.id);
  const [tab, setTab] = useState('visao-geral');

  const nome = data?.profile?.nome || user?.name || user?.email?.split('@')[0] || 'Colaborador';
  const hoje = new Date();
  const saudacao = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  const completude = (() => {
    if (!data?.profile) return 0;
    const campos = ['nome', 'telefone', 'cargo', 'departamento'];
    return Math.round((campos.filter(c => (data.profile as any)?.[c]).length / campos.length) * 100);
  })();

  return (
    <>
      <PageTitle title="Portal" description="Portal do colaborador" />
      <PageLayout title="Meu Portal" description={`${saudacao}, ${nome}!`} icon={<UserCircle className="h-5 w-5 text-primary-foreground" />} gradient="from-success to-primary">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="visao-geral"><UserCircle className="mr-1 h-4 w-4" />Visão Geral</TabsTrigger>
            <TabsTrigger value="financeiro"><DollarSign className="mr-1 h-4 w-4" />Financeiro</TabsTrigger>
            <TabsTrigger value="documentos"><FileText className="mr-1 h-4 w-4" />Documentos</TabsTrigger>
            <TabsTrigger value="meus-dados"><Edit className="mr-1 h-4 w-4" />Meus Dados</TabsTrigger>
          </TabsList>
          <TabsContent value="visao-geral"><PortalOverviewTab nome={nome} data={data} completude={completude} navigate={navigate} /></TabsContent>
          <TabsContent value="financeiro"><PortalFinanceiroTab holerites={data?.holerites || []} beneficios={data?.beneficios || []} /></TabsContent>
          <TabsContent value="documentos"><PortalDocumentosTab navigate={navigate} colaboradorId={data?.profile?.id} /></TabsContent>
          <TabsContent value="meus-dados"><PortalMeusDadosTab nome={nome} email={user?.email || ''} profile={data?.profile} userId={user?.id || ''} navigate={navigate} /></TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}
