// V15-409
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Users, Calendar, Clock } from 'lucide-react';
const treinamentos = [{ id: '1', nome: 'NR-10 Segurança', descricao: 'Segurança em instalações elétricas', vagas: 20, inscritos: 15, data: '20/01/2025', duracao: '8h' }, { id: '2', nome: 'NR-35 Altura', descricao: 'Trabalho em altura', vagas: 15, inscritos: 15, data: '25/01/2025', duracao: '16h' }];
export default function TreinamentosPage() {
  return (
    <PageLayout title="Treinamentos" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo Treinamento</Button>}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {treinamentos.map(t => (<Card key={t.id}><CardHeader><CardTitle className="text-base">{t.nome}</CardTitle><CardDescription>{t.descricao}</CardDescription></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground"><div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{t.data}</div><div className="flex items-center gap-1"><Clock className="h-4 w-4" />{t.duracao}</div></div>
          <div><div className="flex justify-between text-sm mb-1"><span>Inscrições</span><span>{t.inscritos}/{t.vagas}</span></div><Progress value={(t.inscritos / t.vagas) * 100} /></div>
          <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1"><Users className="h-4 w-4 mr-1" />Inscritos</Button><Button size="sm" className="flex-1" disabled={t.inscritos >= t.vagas}>{t.inscritos >= t.vagas ? 'Lotado' : 'Inscrever'}</Button></div>
        </CardContent></Card>))}
      </div>
    </PageLayout>
  );
}
