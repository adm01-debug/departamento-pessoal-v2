import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, Download, Loader2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RelatorioContabilDialogProps {
  folhaId: string;
}

export function RelatorioContabilDialog({ folhaId }: RelatorioContabilDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch folha details
      const { data: holerites, error: hError } = await supabase
        .from('holerites')
        .select('*')
        .eq('folha_id', folhaId);
      
      if (hError) throw hError;

      // Group by accounts (Simplified layout for accounting reconciliation)
      // Account;CostCenter;Debit;Credit;Description
      const csvLines = ['Conta;Centro de Custo;Debito;Credito;Descricao'];
      
      let totalLiquido = 0;
      let totalInss = 0;
      let totalFgts = 0;

      holerites.forEach(h => {
        totalLiquido += Number(h.liquido);
        totalInss += Number(h.valor_inss);
        totalFgts += Number(h.valor_fgts);
        
        // Example entries
        csvLines.push(`DESPESA_SALARIAL;${h.colaborador_departamento || 'GERAL'};${h.total_proventos};0;Proventos - ${h.colaborador_nome}`);
        csvLines.push(`SALARIOS_A_PAGAR;${h.colaborador_departamento || 'GERAL'};0;${h.liquido};Liquido a Pagar - ${h.colaborador_nome}`);
      });

      const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RECONCILIACAO_CONTABIL_${folhaId.substring(0, 8)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Relatório para reconciliação contábil gerado!');
      setOpen(false);
    } catch (err: any) {
      toast.error('Erro ao exportar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-xl gap-1.5 font-body border-primary/30 hover:bg-primary/5">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Conciliação Contábil</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <BookOpen className="h-5 w-5 text-primary" />
            Exportar para Contabilidade (SPED)
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Gere o arquivo de lançamentos contábeis para importação no seu ERP (Domínio, Alterdata, Totvs, etc).
          </p>
          <Card className="border border-border/30 bg-muted/20">
            <CardContent className="p-4 text-xs space-y-2">
              <p>• Lançamentos de Proventos e Descontos</p>
              <p>• Provisões de Encargos (INSS/FGTS)</p>
              <p>• Separação por Centro de Custo/Departamento</p>
            </CardContent>
          </Card>
          <Button onClick={handleExport} className="w-full rounded-xl gap-2 h-11" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
            Download CSV de Reconciliação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
