import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Printer, Filter } from 'lucide-react';

interface Filtros { periodo: string; departamento: string; colaborador: string; }

export const RelatorioASO: React.FC = () => {
  const [filtros, setFiltros] = useState<Filtros>({ periodo: '', departamento: '', colaborador: '' });
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async (formato: 'pdf' | 'excel') => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    console.log('Gerando ASO - Atestado de Saúde Ocupacional em', formato);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />ASO - Atestado de Saúde Ocupacional</CardTitle>
        <CardDescription>Exames admissionais, periódicos e demissionais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><Label>Período</Label><Input type="month" value={filtros.periodo} onChange={(e) => setFiltros({...filtros, periodo: e.target.value})} /></div>
          <div><Label>Departamento</Label><Select value={filtros.departamento} onValueChange={(v) => setFiltros({...filtros, departamento: v})}><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="rh">RH</SelectItem><SelectItem value="ti">TI</SelectItem><SelectItem value="financeiro">Financeiro</SelectItem></SelectContent></Select></div>
          <div><Label>Colaborador</Label><Input value={filtros.colaborador} onChange={(e) => setFiltros({...filtros, colaborador: e.target.value})} placeholder="Buscar..." /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => gerarRelatorio('pdf')} disabled={loading}><Download className="h-4 w-4 mr-2" />Exportar PDF</Button>
          <Button variant="outline" onClick={() => gerarRelatorio('excel')} disabled={loading}><Download className="h-4 w-4 mr-2" />Exportar Excel</Button>
          <Button variant="outline"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default RelatorioASO;
