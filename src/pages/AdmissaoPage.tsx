// V15-402
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserPlus, FileText, Send, CheckCircle } from 'lucide-react';
const etapas = [{ id: 1, nome: 'Dados Pessoais', status: 'completo', icon: UserPlus }, { id: 2, nome: 'Documentos', status: 'em_andamento', icon: FileText }, { id: 3, nome: 'Envio eSocial', status: 'pendente', icon: Send }, { id: 4, nome: 'Conclusão', status: 'pendente', icon: CheckCircle }];
export default function AdmissaoPage() {
  return (
    <PageLayout title="Nova Admissão" description="Processo de admissão de novo colaborador">
      <div className="mb-6"><Progress value={50} className="h-2" /><p className="text-sm text-muted-foreground mt-2">Etapa 2 de 4</p></div>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {etapas.map(e => (<Card key={e.id} className={e.status === 'em_andamento' ? 'border-primary' : ''}><CardContent className="pt-6 flex items-center gap-4"><e.icon className={"h-8 w-8 " + (e.status === 'completo' ? 'text-green-600' : e.status === 'em_andamento' ? 'text-primary' : 'text-muted-foreground')} /><div><p className="font-medium">{e.nome}</p><p className="text-sm text-muted-foreground capitalize">{e.status.replace('_', ' ')}</p></div></CardContent></Card>))}
      </div>
      <Card><CardHeader><CardTitle>Documentos Pendentes</CardTitle><CardDescription>Faça upload dos documentos necessários</CardDescription></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">• RG ou CNH</p><p className="text-sm text-muted-foreground">• CPF</p><p className="text-sm text-muted-foreground">• Comprovante de Residência</p><p className="text-sm text-muted-foreground">• Carteira de Trabalho</p><Button className="mt-4">Fazer Upload</Button></CardContent></Card>
    </PageLayout>
  );
}
