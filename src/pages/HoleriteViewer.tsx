// V15-323
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Printer } from 'lucide-react';
export default function HoleriteViewer() {
  const { id, competencia } = useParams();
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const proventos = [{ descricao: 'Salário Base', referencia: '30 dias', valor: 5000 }, { descricao: 'Horas Extras 50%', referencia: '10:00', valor: 350 }];
  const descontos = [{ descricao: 'INSS', referencia: '11%', valor: 550 }, { descricao: 'IRRF', referencia: '7.5%', valor: 180 }];
  return (
    <PageLayout title="Holerite" description={competencia} actions={<><Button variant="outline"><Printer className="h-4 w-4 mr-2" />Imprimir</Button><Button><Download className="h-4 w-4 mr-2" />PDF</Button></>}>
      <Card>
        <CardHeader><CardTitle>João da Silva</CardTitle><p className="text-sm text-muted-foreground">Desenvolvedor Senior - Admissão: 01/03/2020</p></CardHeader>
        <CardContent className="space-y-6">
          <div><h4 className="font-medium mb-2">Proventos</h4><div className="space-y-2">{proventos.map((p, i) => (<div key={i} className="flex justify-between text-sm"><span>{p.descricao}</span><span>{p.referencia}</span><span className="text-green-600 font-medium">{fmt(p.valor)}</span></div>))}</div></div>
          <Separator />
          <div><h4 className="font-medium mb-2">Descontos</h4><div className="space-y-2">{descontos.map((d, i) => (<div key={i} className="flex justify-between text-sm"><span>{d.descricao}</span><span>{d.referencia}</span><span className="text-red-600 font-medium">{fmt(d.valor)}</span></div>))}</div></div>
          <Separator />
          <div className="flex justify-between text-lg font-bold"><span>Líquido</span><span>{fmt(4620)}</span></div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
