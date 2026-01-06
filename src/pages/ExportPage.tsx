import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Database, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { useToast } from '@/hooks/useToast';

const exportOptions = [
  { id: 'colaboradores', label: 'Colaboradores', icon: Database },
  { id: 'folha', label: 'Folha de Pagamento', icon: FileSpreadsheet },
  { id: 'ferias', label: 'Férias', icon: Calendar },
  { id: 'ponto', label: 'Ponto', icon: Calendar },
  { id: 'beneficios', label: 'Benefícios', icon: FileText },
];

export default function ExportPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [format, setFormat] = useState('xlsx');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 20, 100)), 500);
    setTimeout(() => { clearInterval(interval); setProgress(100); setExporting(false); toast({ title: 'Exportação concluída' }); }, 3000);
  };

  return (
    <PageLayout>
      <PageHeader title="Exportar Dados" description="Exporte dados do sistema" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Exportar' }]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Selecione os dados</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {exportOptions.map(opt => (
              <div key={opt.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox checked={selected.includes(opt.id)} onCheckedChange={c => setSelected(c ? [...selected, opt.id] : selected.filter(s => s !== opt.id))} />
                <opt.icon className="w-5 h-5" />
                <span>{opt.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Formato</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Formato do arquivo</Label><Select value={format} onValueChange={setFormat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="xlsx">Excel (.xlsx)</SelectItem><SelectItem value="csv">CSV (.csv)</SelectItem><SelectItem value="pdf">PDF (.pdf)</SelectItem><SelectItem value="json">JSON (.json)</SelectItem></SelectContent></Select></div>
            {exporting && <Progress value={progress} />}
            <Button className="w-full" onClick={handleExport} disabled={selected.length === 0 || exporting}><Download className="w-4 h-4 mr-2" />{exporting ? 'Exportando...' : 'Exportar'}</Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
