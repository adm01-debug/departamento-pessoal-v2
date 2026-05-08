import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FileDown, Settings2, Loader2, Landmark, CheckCircle2, Zap } from 'lucide-react';
import { cnabService, CNABConfig } from '@/services/cnabService';
import { toast } from 'sonner';
import { useEmpresas } from '@/hooks/useEmpresas';

interface CNABDialogProps {
  folhaId: string;
}

export function CNABDialog({ folhaId }: CNABDialogProps) {
  const { empresaAtual } = useEmpresas();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<CNABConfig>({
    banco_codigo: '001', // Default BB
    agencia: '',
    agencia_digito: '',
    conta: '',
    conta_digito: '',
    convenio: '',
    nome_empresa: '',
  });

  useEffect(() => {
    if (open && empresaAtual?.id) {
      loadConfig();
    }
  }, [open, empresaAtual?.id]);

  const loadConfig = async () => {
    try {
      const data = await cnabService.getConfig(empresaAtual!.id);
      if (data) {
        setConfig({
          banco_codigo: data.banco_codigo,
          agencia: data.agencia,
          agencia_digito: data.agencia_digito,
          conta: data.conta,
          conta_digito: data.conta_digito,
          convenio: data.convenio,
          nome_empresa: data.nome_empresa || empresaAtual?.razao_social || '',
        });
      } else {
          setConfig(prev => ({ ...prev, nome_empresa: empresaAtual?.razao_social || '' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async () => {
    if (!empresaAtual?.id) return;
    setSaving(true);
    try {
      await cnabService.saveConfig(empresaAtual.id, config);
      toast.success('Configurações bancárias salvas!');
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!empresaAtual?.id) return;
    setLoading(true);
    try {
      const content = await cnabService.generateCNAB240(empresaAtual.id, folhaId);
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CNAB240_PAGTO_${new Date().toISOString().slice(0, 10)}.rem`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Arquivo CNAB 240 gerado com sucesso!');
      setOpen(false);
    } catch (err: any) {
      toast.error('Erro ao gerar CNAB: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePIX = async () => {
    if (!empresaAtual?.id) return;
    setLoading(true);
    try {
      const content = await cnabService.generatePIXBatch(empresaAtual.id, folhaId);
      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LOTE_PIX_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Lote PIX gerado com sucesso!');
      setOpen(false);
    } catch (err: any) {
      toast.error('Erro ao gerar PIX: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-xl gap-1.5 font-body border-primary/30 hover:bg-primary/5">
          <FileDown className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Gerar CNAB 240</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Landmark className="h-5 w-5 text-primary" />
            Pagamento Bancário (CNAB 240)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="border border-border/30 shadow-none bg-muted/20">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <Settings2 className="h-4 w-4" />
                Configuração da Conta Origem
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Código do Banco</Label>
                  <Input placeholder="001" value={config.banco_codigo} onChange={e => setConfig(p => ({ ...p, banco_codigo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Número do Convênio</Label>
                  <Input placeholder="1234567" value={config.convenio} onChange={e => setConfig(p => ({ ...p, convenio: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Agência</Label>
                  <Input placeholder="1234" value={config.agencia} onChange={e => setConfig(p => ({ ...p, agencia: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">DV</Label>
                  <Input placeholder="X" value={config.agencia_digito} onChange={e => setConfig(p => ({ ...p, agencia_digito: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Conta Corrente</Label>
                  <Input placeholder="12345678" value={config.conta} onChange={e => setConfig(p => ({ ...p, conta: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">DV</Label>
                  <Input placeholder="0" value={config.conta_digito} onChange={e => setConfig(p => ({ ...p, conta_digito: e.target.value }))} />
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleSaveConfig} disabled={saving} className="w-full text-xs gap-1.5 h-8">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                Salvar Configuração de Remessa
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={handleGenerate} className="rounded-xl gap-2 h-11 shadow-lg bg-gradient-to-r from-primary to-primary-glow" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileDown className="h-5 w-5" />}
              CNAB 240
            </Button>
            <Button onClick={handleGeneratePIX} variant="outline" className="rounded-xl gap-2 h-11 border-primary/30 hover:bg-primary/5" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5 text-amber-500" />}
              PIX em Lote
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-medium">
            Formatos compatíveis com bancos tradicionais e fintechs
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
