// V15-478
import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
const org = { nome: 'CEO', cargo: 'Diretor Geral', filhos: [{ nome: 'Dir. RH', cargo: 'Diretor RH', filhos: [{ nome: 'Ger. DP', cargo: 'Gerente DP' }, { nome: 'Ger. R&S', cargo: 'Gerente R&S' }] }, { nome: 'Dir. TI', cargo: 'Diretor TI', filhos: [{ nome: 'Coord. Dev', cargo: 'Coordenador' }] }, { nome: 'Dir. Financeiro', cargo: 'Diretor Financeiro' }] };
const OrgNode = ({ node }: { node: any }) => (
  <div className="flex flex-col items-center">
    <Card className="w-48"><CardContent className="pt-4 flex flex-col items-center"><Avatar className="h-12 w-12 mb-2"><AvatarFallback>{node.nome[0]}</AvatarFallback></Avatar><p className="font-medium text-sm">{node.nome}</p><Badge variant="outline" className="text-xs">{node.cargo}</Badge></CardContent></Card>
    {node.filhos && (<><div className="w-px h-6 bg-border" /><div className="flex gap-8">{node.filhos.map((f: any, i: number) => (<div key={i} className="flex flex-col items-center"><div className="w-px h-6 bg-border" /><OrgNode node={f} /></div>))}</div></>)}
  </div>
);
export default function OrgChartPage() {
  return (<PageLayout title="Organograma"><div className="flex justify-center overflow-auto py-8"><OrgNode node={org} /></div></PageLayout>);
}
