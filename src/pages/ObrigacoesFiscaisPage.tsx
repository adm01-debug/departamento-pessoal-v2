import { PageTitle } from '@/components/PageTitle';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { FileText, Receipt, DollarSign, Building2 } from 'lucide-react';

export default function ObrigacoesFiscaisPage() {
  const { empresaAtual } = useEmpresas();

  const { data: dctf = [], isLoading: l1 } = useQuery({
    queryKey: ['dctfweb', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('dctfweb_declaracoes').select('*').order('competencia', { ascending: false });
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: sefip = [], isLoading: l2 } = useQuery({
    queryKey: ['sefip', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('sefip_arquivos').select('*').order('competencia', { ascending: false });
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: guiasFgts = [], isLoading: l3 } = useQuery({
    queryKey: ['guias-fgts', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('guias_fgts').select('*').order('competencia', { ascending: false });
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const { data: guiasInss = [], isLoading: l4 } = useQuery({
    queryKey: ['guias-inss', empresaAtual?.id],
    queryFn: async () => {
      let q = supabase.from('guias_inss').select('*').order('competencia', { ascending: false });
      if (empresaAtual?.id) q = q.eq('empresa_id', empresaAtual.id);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const isLoading = l1 || l2 || l3 || l4;
  if (isLoading) return <PageLayout title="Obrigações Fiscais"><Spinner /></PageLayout>;

  return (
    <>
    <PageTitle title="Obrigações Fiscais" description="Gestão de obrigações fiscais" />
    <PageLayout title="Obrigações Fiscais" description="DCTFWeb, SEFIP, Guias FGTS e INSS">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{dctf.length}</p><p className="text-sm text-muted-foreground">DCTFWeb</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{sefip.length}</p><p className="text-sm text-muted-foreground">SEFIP</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{guiasFgts.length}</p><p className="text-sm text-muted-foreground">Guias FGTS</p></CardContent></Card>
        <Card><CardContent className="pt-4 text-center"><p className="text-2xl font-bold">{guiasInss.length}</p><p className="text-sm text-muted-foreground">Guias INSS</p></CardContent></Card>
      </div>

      <Tabs defaultValue="dctf">
        <TabsList>
          <TabsTrigger value="dctf"><FileText className="h-4 w-4 mr-1" />DCTFWeb</TabsTrigger>
          <TabsTrigger value="sefip"><Receipt className="h-4 w-4 mr-1" />SEFIP</TabsTrigger>
          <TabsTrigger value="fgts"><DollarSign className="h-4 w-4 mr-1" />FGTS</TabsTrigger>
          <TabsTrigger value="inss"><Building2 className="h-4 w-4 mr-1" />INSS</TabsTrigger>
        </TabsList>

        <TabsContent value="dctf">
          <Card><CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>Status</TableHead><TableHead>Data Envio</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {dctf.map((d: any) => (
                  <TableRow key={d.id}><TableCell>{d.competencia}</TableCell><TableCell><Badge>{d.status}</Badge></TableCell><TableCell>{d.data_envio || '—'}</TableCell><TableCell>{d.valor_total ? `R$ ${Number(d.valor_total).toLocaleString('pt-BR')}` : '—'}</TableCell></TableRow>
                ))}
                {dctf.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma declaração</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="sefip">
          <Card><CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>Status</TableHead><TableHead>Arquivo</TableHead></TableRow></TableHeader>
              <TableBody>
                {sefip.map((s: any) => (
                  <TableRow key={s.id}><TableCell>{s.competencia}</TableCell><TableCell><Badge>{s.status}</Badge></TableCell><TableCell>{s.arquivo_url ? 'Disponível' : '—'}</TableCell></TableRow>
                ))}
                {sefip.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum arquivo</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="fgts">
          <Card><CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>Status</TableHead><TableHead>Valor</TableHead><TableHead>Vencimento</TableHead></TableRow></TableHeader>
              <TableBody>
                {guiasFgts.map((g: any) => (
                  <TableRow key={g.id}><TableCell>{g.competencia}</TableCell><TableCell><Badge>{g.status}</Badge></TableCell><TableCell>{g.valor ? `R$ ${Number(g.valor).toLocaleString('pt-BR')}` : '—'}</TableCell><TableCell>{g.data_vencimento || '—'}</TableCell></TableRow>
                ))}
                {guiasFgts.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma guia</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="inss">
          <Card><CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Competência</TableHead><TableHead>Status</TableHead><TableHead>Valor</TableHead><TableHead>Vencimento</TableHead></TableRow></TableHeader>
              <TableBody>
                {guiasInss.map((g: any) => (
                  <TableRow key={g.id}><TableCell>{g.competencia}</TableCell><TableCell><Badge>{g.status}</Badge></TableCell><TableCell>{g.valor ? `R$ ${Number(g.valor).toLocaleString('pt-BR')}` : '—'}</TableCell><TableCell>{g.data_vencimento || '—'}</TableCell></TableRow>
                ))}
                {guiasInss.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma guia</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
    </>
  );
}
