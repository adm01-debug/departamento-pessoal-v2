// V15-403
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
const declaracoes = [{ id: 'vinculo', nome: 'Declaração de Vínculo', descricao: 'Comprova vínculo empregatício' }, { id: 'rendimentos', nome: 'Informe de Rendimentos', descricao: 'Para declaração de IR' }, { id: 'salario', nome: 'Declaração de Salário', descricao: 'Comprova remuneração atual' }, { id: 'ferias', nome: 'Recibo de Férias', descricao: 'Comprovante de férias gozadas' }];
export default function DeclaracoesPage() {
  return (
    <PageLayout title="Declarações" description="Emissão de declarações e documentos">
      <div className="grid gap-4 md:grid-cols-2">
        {declaracoes.map(d => (<Card key={d.id}><CardHeader className="flex flex-row items-center gap-4"><FileText className="h-8 w-8 text-primary" /><div><CardTitle className="text-base">{d.nome}</CardTitle><CardDescription>{d.descricao}</CardDescription></div></CardHeader><CardContent><Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" />Gerar</Button></CardContent></Card>))}
      </div>
    </PageLayout>
  );
}
