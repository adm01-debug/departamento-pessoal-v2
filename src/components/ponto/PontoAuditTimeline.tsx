import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search, Download, User, Calendar, Tag, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { exportPontoCSV } from '@/services/exportService';

export function PontoAuditTimeline() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['ponto-audit-logs'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('ponto_auditoria')
        .select('*, usuario:profiles(nome)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    }
  });

  const filteredLogs = auditLogs.filter((log: any) => 
    log.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.justificativa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.usuario?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportAudit = () => {
    const exportData = filteredLogs.map((log: any) => ({
      data: format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
      usuario: log.usuario?.nome || 'Sistema',
      acao: log.acao,
      tabela: log.tabela_nome,
      justificativa: log.justificativa || '-'
    }));
    exportPontoCSV(exportData, 'trilha-auditoria-ponto.csv');
  };

  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden mt-6">
      <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display flex items-center gap-2">
          <History className="h-4 w-4 text-primary" /> Trilha de Auditoria (Timeline)
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Buscar na trilha..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs w-48"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleExportAudit}>
            <Download className="h-3 w-3" /> Exportar Trilha
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-[11px] before:w-px before:bg-border/50">
            {filteredLogs.map((log: any, idx: number) => (
              <div key={log.id} className="relative pl-8 group">
                <div className="absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] h-5 bg-primary/5 text-primary border-primary/20">
                        {log.acao}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {format(new Date(log.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 rounded">
                      ID: {log.registro_id.slice(0, 8)}
                    </span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/40 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{log.usuario?.nome || 'Sistema (Automático)'}</span>
                    </div>
                    
                    {log.justificativa && (
                      <p className="text-xs text-muted-foreground italic bg-background/50 p-2 rounded-lg border border-dashed mb-2">
                        "{log.justificativa}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Tag className="h-3 w-3" /> Tabela: {log.tabela_nome}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
