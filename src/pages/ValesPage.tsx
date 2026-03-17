import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { UtensilsCrossed, Bus, CreditCard } from 'lucide-react';

export default function ValesPage() {
  const { empresaAtual } = useEmpresas();

  const { data: va, isLoading: loadVA } = useQuery({
    queryKey: ['vales-alimentacao', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('vales_alimentacao').select('*, colaborador:colaboradores(nome_completo)');
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: vt, isLoading: loadVT } = useQuery({
    queryKey: ['vales-transporte'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vales_transporte').select('*, colaborador:colaboradores(nome_completo)');
      if (error) throw error;
      return data || [];
    },
  });

  const fmt = (v: number | null) => v ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';

  return (
    <PageLayout title="Vales" description="Vale Alimentação, Vale Refeição e Vale Transporte" icon={<CreditCard className="h-5 w-5 text-primary-foreground" />}>
      <Tabs defaultValue="alimentacao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alimentacao"><UtensilsCrossed className="mr-1 h-4 w-4" />VA / VR</TabsTrigger>
          <TabsTrigger value="transporte"><Bus className="mr-1 h-4 w-4" />VT</TabsTrigger>
        </TabsList>

        <TabsContent value="alimentacao">
          <Card><CardContent className="p-0">
            {loadVA ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Valor/Dia</TableHead><TableHead>Valor Mensal</TableHead><TableHead>Dias Úteis</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {va?.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.colaborador?.nome_completo || '-'}</TableCell>
                      <TableCell className="capitalize">{r.tipo || 'VA'}</TableCell>
                      <TableCell>{fmt(r.valor_por_dia)}</TableCell>
                      <TableCell>{fmt(r.valor_mensal)}</TableCell>
                      <TableCell>{r.dias_uteis ?? '-'}</TableCell>
                      <TableCell><Badge variant={r.ativo ? 'default' : 'secondary'}>{r.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {!va?.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum VA/VR cadastrado</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="transporte">
          <Card><CardContent className="p-0">
            {loadVT ? <div className="p-8 flex justify-center"><Spinner /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Optante</TableHead><TableHead>Valor Diário</TableHead><TableHead>Valor Mensal</TableHead><TableHead>Desconto</TableHead><TableHead>Líquido</TableHead></TableRow></TableHeader>
                <TableBody>
                  {vt?.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.colaborador?.nome_completo || '-'}</TableCell>
                      <TableCell>{r.optante ? 'Sim' : 'Não'}</TableCell>
                      <TableCell>{fmt(r.valor_diario)}</TableCell>
                      <TableCell>{fmt(r.valor_mensal)}</TableCell>
                      <TableCell>{fmt(r.desconto)}</TableCell>
                      <TableCell>{fmt(r.valor_liquido)}</TableCell>
                    </TableRow>
                  ))}
                  {!vt?.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum VT cadastrado</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
