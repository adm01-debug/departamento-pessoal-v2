/**
 * @fileoverview Informe de rendimentos anual
 * @module components/documentos/InformeRendimentos
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Printer } from 'lucide-react';

interface InformeRendimentosProps {
  anoBase: number;
  colaborador: { nome: string; cpf: string; };
  empresa: { razaoSocial: string; cnpj: string; };
  rendimentos: { descricao: string; valor: number; }[];
  deducoes: { descricao: string; valor: number; }[];
  onDownload?: () => void;
  onPrint?: () => void;
}

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Informe de rendimentos para IR
 */
export const InformeRendimentos = memo(function InformeRendimentos({
  anoBase, colaborador, empresa, rendimentos, deducoes, onDownload, onPrint
}: InformeRendimentosProps) {
  const totalRendimentos = rendimentos.reduce((acc, r) => acc + r.valor, 0);
  const totalDeducoes = deducoes.reduce((acc, d) => acc + d.valor, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Informe de Rendimentos {anoBase}</CardTitle>
        <div className="flex gap-2">
          {onPrint && <Button variant="outline" size="sm" onClick={onPrint}><Printer className="h-4 w-4 mr-1" />Imprimir</Button>}
          {onDownload && <Button size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />PDF</Button>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div><p className="text-sm text-muted-foreground">Colaborador</p><p className="font-medium">{colaborador.nome}</p><p className="text-sm">{colaborador.cpf}</p></div>
          <div><p className="text-sm text-muted-foreground">Fonte Pagadora</p><p className="font-medium">{empresa.razaoSocial}</p><p className="text-sm">{empresa.cnpj}</p></div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Rendimentos Tributáveis</h3>
          <Table>
            <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
            <TableBody>
              {rendimentos.map((r, i) => <TableRow key={i}><TableCell>{r.descricao}</TableCell><TableCell className="text-right">{formatCurrency(r.valor)}</TableCell></TableRow>)}
              <TableRow className="font-medium"><TableCell>Total</TableCell><TableCell className="text-right">{formatCurrency(totalRendimentos)}</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="font-medium mb-2">Deduções</h3>
          <Table>
            <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
            <TableBody>
              {deducoes.map((d, i) => <TableRow key={i}><TableCell>{d.descricao}</TableCell><TableCell className="text-right">{formatCurrency(d.valor)}</TableCell></TableRow>)}
              <TableRow className="font-medium"><TableCell>Total</TableCell><TableCell className="text-right">{formatCurrency(totalDeducoes)}</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
});
