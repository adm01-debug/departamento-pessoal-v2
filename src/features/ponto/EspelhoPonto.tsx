// V15-512
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
const dias = [{ data: '11/01', dia: 'Sab', entrada: '-', saidaAlm: '-', retornoAlm: '-', saida: '-', total: '-', obs: 'Folga' }, { data: '10/01', dia: 'Sex', entrada: '08:02', saidaAlm: '12:05', retornoAlm: '13:00', saida: '17:35', total: '08:38', obs: '' }, { data: '09/01', dia: 'Qui', entrada: '08:15', saidaAlm: '12:00', retornoAlm: '13:00', saida: '17:45', total: '08:30', obs: 'Atraso' }];
export function EspelhoPonto() {
  return (
    <Card><CardHeader><CardTitle>Espelho de Ponto - Janeiro/2025</CardTitle></CardHeader><CardContent>
      <Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Dia</TableHead><TableHead>Entrada</TableHead><TableHead>Saída Alm.</TableHead><TableHead>Retorno</TableHead><TableHead>Saída</TableHead><TableHead>Total</TableHead><TableHead>Obs</TableHead></TableRow></TableHeader>
        <TableBody>{dias.map((d, i) => (<TableRow key={i}><TableCell>{d.data}</TableCell><TableCell>{d.dia}</TableCell><TableCell>{d.entrada}</TableCell><TableCell>{d.saidaAlm}</TableCell><TableCell>{d.retornoAlm}</TableCell><TableCell>{d.saida}</TableCell><TableCell className="font-medium">{d.total}</TableCell><TableCell>{d.obs && <Badge variant={d.obs === 'Folga' ? 'secondary' : 'destructive'}>{d.obs}</Badge>}</TableCell></TableRow>))}</TableBody>
      </Table>
    </CardContent></Card>
  );
}
