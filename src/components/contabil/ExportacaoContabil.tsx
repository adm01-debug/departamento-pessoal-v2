/**
 * @fileoverview Exportação contábil
 * @module components/contabil/ExportacaoContabil
 */
import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';

interface ExportacaoContabilProps {
  competencias: string[];
  layouts: { id: string; nome: string }[];
  onExportar: (competencia: string, layout: string) => void;
}

export const ExportacaoContabil = memo(function ExportacaoContabil({ competencias, layouts, onExportar }: ExportacaoContabilProps) {
  const [competencia, setCompetencia] = useState('');
  const [layout, setLayout] = useState('');

  const handleExportar = () => {
    if (competencia && layout) onExportar(competencia, layout);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />Exportação Contábil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" />Competência</Label>
            <Select value={competencia} onValueChange={setCompetencia}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{competencias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{layouts.map(l => <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleExportar} disabled={!competencia || !layout} className="w-full"><Download className="h-4 w-4 mr-2" />Exportar</Button>
      </CardContent>
    </Card>
  );
});
