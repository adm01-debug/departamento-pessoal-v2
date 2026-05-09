import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, ChevronLeft, ChevronRight, Clock, AlertTriangle, Download, FileJson, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks';
import { motion } from 'framer-motion';
import { exportPontoCSV, exportPontoPDF } from '@/services/exportService';
import { toast } from 'sonner';

export function GestaoRegistrosPonto() {
  const { empresaAtual } = useEmpresas();
  const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]);
  const [busca, setBusca] = useState('');

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['gestao-registros-ponto', empresaAtual?.id, filtroData],
    queryFn: async () => {
      if (!empresaAtual?.id) return [];
      const { data, error } = await (supabase as any)
        .from('registros_ponto')
        .select('*, colaborador:colaboradores(nome_completo, cargo, departamento, foto_url)')
        .eq('empresa_id', empresaAtual.id)
        .eq('data', filtroData)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
      return data || [];
    },
    enabled: !!empresaAtual?.id,
  });

  const formatTime = (val: any) => {
    if (!val) return '--:--';
    const m = String(val).match(/(\d+):(\d+)/);
    return m ? `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}` : '--:--';
  };

  const formatInterval = (val: any) => {
    if (!val) return '00:00';
    const m = String(val).match(/(\d+):(\d+)/);
    return m ? `${m[1].padStart(2, '0')}:${m[2].padStart(2, '0')}` : '00:00';
  };

  const filtrados = registros.filter((r: any) => {
    if (!busca) return true;
    const nome = r.colaborador?.nome_completo?.toLowerCase() || '';
    return nome.includes(busca.toLowerCase());
  });

  const mudarDia = (offset: number) => {
    const d = new Date(filtroData + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    setFiltroData(d.toISOString().split('T')[0]);
  };

  const exportData = (format: 'csv' | 'pdf') => {
    if (filtrados.length === 0) {
      toast.error('Nenhum dado para exportar');
      return;
    }

    const dataToExport = filtrados.map((r: any) => ({
      colaborador: r.colaborador?.nome_completo,
      data: r.data,
      entrada_1: formatTime(r.entrada_1),
      saida_intervalo: formatTime(r.saida_intervalo),
      retorno_intervalo: formatTime(r.retorno_intervalo),
      saida_1: formatTime(r.saida_1),
      horas_trabalhadas: formatInterval(r.horas_trabalhadas),
      horas_extras: formatInterval(r.horas_extras),
    }));

    if (format === 'csv') {
      exportPontoCSV(dataToExport, `ponto-${filtroData}.csv`);
    } else {
      exportPontoPDF(
        dataToExport, 
        `Relatório de Ponto - ${filtroData}`, 
        ['colaborador', 'entrada_1', 'saida_intervalo', 'retorno_intervalo', 'saida_1', 'horas_trabalhadas']
      );
    }
    toast.success('Relatório gerado com sucesso!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-6">
      <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="font-display flex items-center gap-2">
              <Users className="h-4 w-4 text-info" /> Controle de Ponto - Todos Colaboradores
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => mudarDia(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-40 h-8 text-sm"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => mudarDia(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center border rounded-lg overflow-hidden ml-2 h-8">
                <Button variant="ghost" size="sm" className="h-full px-2 text-xs gap-1 border-r rounded-none" onClick={() => exportData('csv')}>
                  <FileJson className="h-3 w-3" /> CSV
                </Button>
                <Button variant="ghost" size="sm" className="h-full px-2 text-xs gap-1 rounded-none" onClick={() => exportData('pdf')}>
                  <FileText className="h-3 w-3" /> PDF
                </Button>
              </div>
            </div>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar colaborador..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-3 rounded-2xl bg-muted/50 mb-3">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-body">Nenhum registro encontrado para esta data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Colaborador</TableHead>
                    <TableHead className="font-display font-semibold">Entrada 1</TableHead>
                    <TableHead className="font-display font-semibold">Saída Int.</TableHead>
                    <TableHead className="font-display font-semibold">Ret. Int.</TableHead>
                    <TableHead className="font-display font-semibold">Saída 1</TableHead>
                    <TableHead className="font-display font-semibold">Trabalhadas</TableHead>
                    <TableHead className="font-display font-semibold">Extras</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((r: any) => {
                    const trabalhadas = formatInterval(r.horas_trabalhadas);
                    const extras = formatInterval(r.horas_extras);
                    const temAtraso = r.atraso_minutos > 0;
                    const temFalta = formatInterval(r.horas_falta) !== '00:00';
                    const aberto = !r.saida_1 && r.entrada_1;

                    return (
                      <TableRow key={r.id} className="hover:bg-accent/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {r.colaborador?.foto_url ? (
                              <img src={r.colaborador.foto_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {(r.colaborador?.nome_completo || '?')[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-body font-medium text-sm">{r.colaborador?.nome_completo || '—'}</p>
                              <p className="text-[10px] text-muted-foreground">{r.colaborador?.cargo}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{formatTime(r.entrada_1)}</TableCell>
                        <TableCell className="font-mono text-sm">{formatTime(r.saida_intervalo)}</TableCell>
                        <TableCell className="font-mono text-sm">{formatTime(r.retorno_intervalo)}</TableCell>
                        <TableCell className="font-mono text-sm">{formatTime(r.saida_1)}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm font-medium text-success">{trabalhadas}</span>
                        </TableCell>
                        <TableCell>
                          {extras !== '00:00' ? (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-info">+{extras}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {aberto && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-warning border-warning/30">
                                <Clock className="h-3 w-3 mr-0.5" /> Aberto
                              </Badge>
                            )}
                            {temAtraso && (
                              <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                                <AlertTriangle className="h-3 w-3 mr-0.5" /> {r.atraso_minutos}min
                              </Badge>
                            )}
                            {temFalta && (
                              <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Falta</Badge>
                            )}
                            {!aberto && !temAtraso && !temFalta && r.saida_1 && (
                              <Badge className="text-[10px] h-5 px-1.5 bg-success/10 text-success border-success/30" variant="outline">✓ OK</Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-3 font-body">
                {filtrados.length} registro(s) encontrado(s)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
