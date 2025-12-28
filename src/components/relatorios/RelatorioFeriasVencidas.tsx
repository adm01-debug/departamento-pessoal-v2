import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Filter, RefreshCw } from 'lucide-react';

interface RelatorioFeriasVencidasProps {
  data?: any[];
  periodo?: { inicio: Date; fim: Date };
  onExport?: (format: 'pdf' | 'excel') => void;
  onRefresh?: () => void;
}

export const RelatorioFeriasVencidas: React.FC<RelatorioFeriasVencidasProps> = ({ data = [], periodo, onExport, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            RelatorioFeriasVencidas
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport?.('pdf')}>
              <Download className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport?.('excel')}>
              <Download className="h-4 w-4 mr-1" /> Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum dado disponível</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.descricao || '-'}</TableCell>
                  <TableCell>{item.valor || '-'}</TableCell>
                  <TableCell>{item.data || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatorioFeriasVencidas;
