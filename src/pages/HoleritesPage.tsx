import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { FileText, Search } from 'lucide-react';

export default function HoleritesPage() {
  const [busca, setBusca] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['holerites'],
    queryFn: async () => {
      const { data, error } = await supabase.from('holerites').select('*').order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return data || [];
    },
  });

  const fmt = (v: number | null) => v != null ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
  const filtered = data?.filter(h => h.colaborador_nome?.toLowerCase().includes(busca.toLowerCase()) || h.colaborador_cpf?.includes(busca)) || [];

  return (
    <PageLayout title="Holerites" description="Demonstrativos de pagamento dos colaboradores" icon={<FileText className="h-5 w-5 text-primary-foreground" />}>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou CPF..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
      </div>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-8 flex justify-center"><Spinner /></div> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Colaborador</TableHead><TableHead>CPF</TableHead><TableHead>Cargo</TableHead>
              <TableHead>Salário Base</TableHead><TableHead>Proventos</TableHead><TableHead>Descontos</TableHead><TableHead>Líquido</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.colaborador_nome}</TableCell>
                  <TableCell>{r.colaborador_cpf}</TableCell>
                  <TableCell>{r.colaborador_cargo}</TableCell>
                  <TableCell>{fmt(r.salario_base)}</TableCell>
                  <TableCell className="text-emerald-600 font-medium">{fmt(r.total_proventos)}</TableCell>
                  <TableCell className="text-destructive font-medium">{fmt(r.total_descontos)}</TableCell>
                  <TableCell className="font-bold">{fmt(r.liquido)}</TableCell>
                </TableRow>
              ))}
              {!filtered.length && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum holerite encontrado</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </PageLayout>
  );
}
