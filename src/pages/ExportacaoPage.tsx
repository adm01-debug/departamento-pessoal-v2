// V15-333
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/components/forms';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
const tiposExportacao = [{ value: 'colaboradores', label: 'Lista de Colaboradores' }, { value: 'folha', label: 'Folha de Pagamento' }, { value: 'ferias', label: 'Relatório de Férias' }, { value: 'ponto', label: 'Espelho de Ponto' }];
const formatos = [{ value: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet }, { value: 'csv', label: 'CSV (.csv)', icon: FileText }, { value: 'pdf', label: 'PDF (.pdf)', icon: File }];
export default function ExportacaoPage() {
  const [tipo, setTipo] = useState(''); const [formato, setFormato] = useState('xlsx');
  return (
    <PageLayout title="Exportação de Dados">
      <Card><CardHeader><CardTitle>Configurar Exportação</CardTitle></CardHeader><CardContent className="space-y-4">
        <FormSelect label="Tipo de Relatório" options={tiposExportacao} value={tipo} onChange={setTipo} />
        <div className="space-y-2"><label className="text-sm font-medium">Período</label><DateRangePicker /></div>
        <FormSelect label="Formato" options={formatos.map(f => ({ value: f.value, label: f.label }))} value={formato} onChange={setFormato} />
        <Button className="w-full" disabled={!tipo}><Download className="h-4 w-4 mr-2" />Exportar</Button>
      </CardContent></Card>
    </PageLayout>
  );
}
