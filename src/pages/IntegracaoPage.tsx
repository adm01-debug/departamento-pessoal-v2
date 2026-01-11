// V15-334
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Settings, CheckCircle, XCircle } from 'lucide-react';
const integracoes = [{ id: 'esocial', nome: 'eSocial', descricao: 'Integração com sistema eSocial', status: 'ativo' }, { id: 'contabil', nome: 'Sistema Contábil', descricao: 'Exportação para contabilidade', status: 'ativo' }, { id: 'banco', nome: 'Banco (CNAB)', descricao: 'Remessa bancária', status: 'inativo' }, { id: 'ponto', nome: 'Relógio de Ponto', descricao: 'Integração com REP', status: 'ativo' }];
export default function IntegracaoPage() {
  return (
    <PageLayout title="Integrações">
      <div className="grid gap-4 md:grid-cols-2">
        {integracoes.map(i => (
          <Card key={i.id}><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="text-base">{i.nome}</CardTitle><CardDescription>{i.descricao}</CardDescription></div><Switch checked={i.status === 'ativo'} /></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">{i.status === 'ativo' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />}<Badge variant={i.status === 'ativo' ? 'default' : 'secondary'}>{i.status}</Badge></div>
              <div className="flex gap-2"><Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Sincronizar</Button><Button variant="outline" size="sm"><Settings className="h-4 w-4" /></Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
