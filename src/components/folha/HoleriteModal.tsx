/**
 * @fileoverview Modal de holerite
 * @module components/folha/HoleriteModal
 */
import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Printer } from 'lucide-react';

interface Verba { codigo: string; descricao: string; referencia?: string; valor: number; tipo: 'provento' | 'desconto'; }
interface HoleriteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaborador: { nome: string; cargo: string; departamento: string; };
  competencia: string;
  verbas: Verba[];
  onDownload?: () => void;
  onPrint?: () => void;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const HoleriteModal = memo(function HoleriteModal({
  open, onOpenChange, colaborador, competencia, verbas, onDownload, onPrint
}: HoleriteModalProps) {
  const proventos = verbas.filter(v => v.tipo === 'provento');
  const descontos = verbas.filter(v => v.tipo === 'desconto');
  const totalProventos = proventos.reduce((a, v) => a + v.valor, 0);
  const totalDescontos = descontos.reduce((a, v) => a + v.valor, 0);
  const liquido = totalProventos - totalDescontos;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Holerite - {competencia}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg text-sm">
            <div><p className="text-muted-foreground">Colaborador</p><p className="font-medium">{colaborador.nome}</p></div>
            <div><p className="text-muted-foreground">Cargo</p><p className="font-medium">{colaborador.cargo}</p></div>
            <div><p className="text-muted-foreground">Departamento</p><p className="font-medium">{colaborador.departamento}</p></div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-600">Proventos</h4>
            <Table>
              <TableHeader><TableRow><TableHead>Cód</TableHead><TableHead>Descrição</TableHead><TableHead>Ref</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {proventos.map(v => <TableRow key={v.codigo}><TableCell>{v.codigo}</TableCell><TableCell>{v.descricao}</TableCell><TableCell>{v.referencia || '-'}</TableCell><TableCell className="text-right">{fmt(v.valor)}</TableCell></TableRow>)}
                <TableRow className="font-medium bg-green-50"><TableCell colSpan={3}>Total Proventos</TableCell><TableCell className="text-right">{fmt(totalProventos)}</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-red-600">Descontos</h4>
            <Table>
              <TableHeader><TableRow><TableHead>Cód</TableHead><TableHead>Descrição</TableHead><TableHead>Ref</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {descontos.map(v => <TableRow key={v.codigo}><TableCell>{v.codigo}</TableCell><TableCell>{v.descricao}</TableCell><TableCell>{v.referencia || '-'}</TableCell><TableCell className="text-right">{fmt(v.valor)}</TableCell></TableRow>)}
                <TableRow className="font-medium bg-red-50"><TableCell colSpan={3}>Total Descontos</TableCell><TableCell className="text-right">{fmt(totalDescontos)}</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <Separator />
          <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
            <span className="font-medium">Líquido a Receber</span>
            <span className="text-2xl font-bold text-primary">{fmt(liquido)}</span>
          </div>
        </div>
        <DialogFooter>
          {onPrint && <Button variant="outline" onClick={onPrint}><Printer className="h-4 w-4 mr-2" />Imprimir</Button>}
          {onDownload && <Button onClick={onDownload}><Download className="h-4 w-4 mr-2" />Download PDF</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
