import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Landmark, FileText, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function FGTSDigitalDashboard() {
  const [loading, setLoading] = useState(false);

  const syncFGTS = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Sincronizado com FGTS Digital (API Gov)');
    }, 1500);
  };

  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden mt-6">
      <div className="h-[2px] bg-gradient-to-r from-success to-primary" />
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Landmark className="h-5 w-5 text-success" />
          FGTS Digital
        </CardTitle>
        <Button size="sm" variant="ghost" className="text-xs gap-1.5" onClick={syncFGTS} disabled={loading}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
          Portal FGTS Digital
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status Guia GFD</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-semibold text-sm">Gerada / Paga</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Vencimento</p>
            <p className="font-semibold text-sm mt-1">20/05/2026</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total a Recolher</p>
            <p className="font-semibold text-sm mt-1 text-primary">R$ 12.450,80</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/30 group">
                <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    <div className="text-xs">
                        <p className="font-medium">Guia de Recolhimento Mensal - 04/2026</p>
                        <p className="text-[10px] text-muted-foreground">Emitida em 05/05/2026</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">Pago</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/30 group">
                <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    <div className="text-xs">
                        <p className="font-medium">Guia Rescisória - Colab. João Silva</p>
                        <p className="text-[10px] text-muted-foreground">Emitida em 07/05/2026</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
