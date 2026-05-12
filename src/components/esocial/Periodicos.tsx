import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

export function S1200Remuneracao({ dados }: { dados: any }) {
  const dmDev = dados.dmDev || [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between border-b pb-2">
        <Label className="text-[10px] uppercase text-muted-foreground">Competência: {dados.perApur}</Label>
        <Label className="text-[10px] uppercase text-muted-foreground">CPF: {dados.cpfTrab}</Label>
      </div>
      
      {dmDev.map((dm: any, idx: number) => (
        <div key={idx} className="space-y-2">
          <p className="text-xs font-bold">Identificador: {dm.ideDmDev}</p>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="h-8 text-[10px]">Rubrica</TableHead>
                  <TableHead className="h-8 text-[10px] text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dm.infoPerApur?.ideEstabLot?.[0]?.detVerbas?.map((v: any, vIdx: number) => (
                  <TableRow key={vIdx} className="h-8">
                    <TableCell className="py-1 text-[11px] font-mono">{v.codRubr}</TableCell>
                    <TableCell className="py-1 text-[11px] text-right font-medium">R$ {v.vrRubr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}

export function S1210Pagamentos({ dados }: { dados: any }) {
  const pgtos = dados.infoPgto || [];
  
  return (
    <div className="space-y-3">
      <Label className="text-[10px] uppercase text-muted-foreground">Rendimentos Pagos - CPF: {dados.cpfTrab}</Label>
      {pgtos.map((p: any, idx: number) => (
        <div key={idx} className="p-3 bg-muted/30 rounded-xl flex justify-between items-center border">
          <div>
            <p className="text-sm font-bold">Data: {p.dtPgto}</p>
            <p className="text-[10px] text-muted-foreground">Tipo: {p.tpPgto === '1' ? 'Ajuste Salarial' : 'Remuneração Mensal'}</p>
          </div>
          <div className="text-right text-xs">
            <span className="opacity-70">Competência:</span> {dados.perApur}
          </div>
        </div>
      ))}
    </div>
  );
}
